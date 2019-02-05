import Form, {
  InputData,
  MuiListPicker,
} from 'react-referential-forms'
import Emitter from '../../src/emitter'
import TokenCard from '../../components/token-card'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'

import { withStyles } from '@material-ui/core/styles'
import { withBalance } from '../../src/balances'
import { watch } from 'react-referential'
import BigNumber from 'bignumber.js'
import {
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from '../../src/wallet'
import classnames from 'classnames'

let addressOptions = {}

@watch('pickAddress')
@withBalance
export default class PickAddress extends Form {
  constructor(props) {
    super(props)

    let { ethBalance, eosBalance } = props

    ethBalance = new BigNumber(ethBalance)
    eosBalance = new BigNumber(eosBalance)

    let [ethAddress] = generateNthEthereumKeys(1)
    let [eosAddress] = generateNthEOSKeys(1)

    addressOptions[ethAddress.publicKey] = {
      label: ethAddress.publicKey,
      secondary: `${ethBalance.toFormat(4)} ($${ethBalance.toFormat(2)})`,
    }

    addressOptions[eosAddress.publicKey] = {
      label: eosAddress.publicKey,
      secondary: `${eosBalance.toFormat(4)} ($${eosBalance.toFormat(2)})`,
    }

    this.inputs = {
      address: new InputData({
        name: 'address',
        data: props.data,
        value: ethAddress.publicKey,
        middleware: [(v) => {
          if (addressOptions[v]) {
            return v
          }

          throw Error('No address selected.')
        }],
      }),
    }

    this.emitter = props.emitter
  }

  back = () => {
    this.emitter.trigger('pick-address:back')
  }

  _submit() {
    this.emitter.trigger('pick-address:submit', this.inputs.address.val())
  }

  render() {
    return pug`
      form(
        autoComplete=this.props.autoComplete
        onSubmit=this.submit
        className=classnames({
          validating: this.state.validating,
          loading: this.state.loading,
          submitted: this.state.submitted,
        })
      )
        .picker
          .picker-header
            h2 Select an Address
            br
          Card.list-picker-wrapper
            MuiListPicker(
              ...this.inputs.address
              options=addressOptions
            )
          br
          if this.getErrorMessage()
            .error
              = this.getErrorMessage()
          .picker-footer.columns
            .button.columns(onClick=this.back)
              ArrowBack
            .button(onClick=this.submit)
              | CONFIRM ADDRESS
      `
  }
}
