import Form, { InputData } from './form'
import Input from '../controls/input'
import Copy from '../controls/copy'
import Emitter from '../../src/emitter'
import { watch } from '../../src/referential/provider'
import matches from '../../src/control-middlewares/matches'
import classnames from 'classnames'
import * as ethers from 'ethers'

@watch('mnemonicForm')
export default class MnemonicForm extends Form {
  static defaultProps = {
    emitter: new Emitter(),
  }

  constructor(props) {
    super(props)

    this.emitter = props.emitter || new Emitter()

    this.emitter.on('mnemonic:get', () => {
      // use hardcoded one for now
      // this.newMnemonic
      return this.mnemonic
    })

    this.newMnemonic()

    this.inputs = {
      mnemonic: new InputData({
        name: 'mnemonic',
        value: this.mnemonic,
      }),
      mnemonicConfirm: new InputData({
        name: 'mnemonicConfirm',
        middleware: [
          matches(() => {
            return this.inputs.mnemonic.val()
          }, 'recover codes')
        ],
      }),
    }

    this.state = {
      copied: false,
      step: 1,
    }
  }

  newMnemonic() {
    this.mnemonic = ethers.utils.HDNode.entropyToMnemonic(ethers.utils.randomBytes(16))
    this.mnemonic = 'good lottery carpet report chapter model digital mosquito divert battle nuclear candy'

    return this.mnemonic
  }

  copy = () => {
    this.inputs.mnemonic.emitter.trigger('copy:copy')
    this.setState({
      copied: true,
    })
  }

  back = () => {
    this.setState({
      step: 1,
    })
  }

  next = () => {
    this.setState({
      step: 2,
    })
  }

  _submit = () => {
    this.emitter.trigger('mnemonic:finish', this.mnemonic)
  }

  render() {
    return pug`
      .mnemonic-forms
        if this.state.step == 1
          .card.mnemonic-copy.transparent
            .card-header.rows
              h2 Back up your Hanzo Account
              p Hanzo does not store your unencrypted account. Copy your recovery code somewhere safe, you must have it to recover your account.
            .card-body
              Copy(
                ...this.inputs.mnemonic
                rows=2
              )
              .columns
                .button.flex0(
                  onClick=this.copy
                  className=classnames({
                    copied: this.state.copied,
                  })
                ) COPY
                .button.flex0(onClick=this.next) NEXT

            small You will be asked to re-enter your recovery code on the next step to finish setting up your account
        if this.state.step == 2
          .card.mnemonic-confirm.transparent
            .card-header.rows
              h2 Almost Done
              p Enter your recovery code to finish setting up your Hanzo account.
            .card-body
              form(
                autoComplete=this.props.autoComplete
                onSubmit=this.submit
                className=classnames({
                  validating: this.state.validating,
                  loading: this.state.loading,
                  submitted: this.state.submitted,
                })
              )
                Input(
                  ...this.inputs.mnemonicConfirm
                  rows=2
                  showErrors=false
                  placeholder='Enter your recovery code here.'
                )
                if this.getErrorMessage()
                  .error
                    = this.getErrorMessage()
                .columns
                  .button.flex0(onClick=this.back) BACK
                  .button.flex0(onClick=this.submit) FINISH
    `
  }
}

