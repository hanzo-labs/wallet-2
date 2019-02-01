import Form, { InputData } from './form'
import Emitter from '../../src/emitter'
import MuiListPicker from '../../components/controls/mui-list-picker'
import TokenCard from '../../components/token-card'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import MonetizationOnOutlined from '@material-ui/icons/MonetizationOnOutlined'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import classnames from 'classnames'

let tokenOptions = {
  '0': {
    label: 'US Treasuries Token (UST)',
    secondary: '1,600.75 ($1,600.75)',
    icon: MonetizationOnOutlined,
  },
}

@watch('pickToken')
export default class PickToken extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      token: new InputData({
        name: 'token',
        data: props.data,
        value: '0',
        middleware: [(v) => {
          if (tokenOptions[v]) {
            return v
          }

          throw Error('No token selected.')
        }],
      }),
    }

    this.emitter = props.emitter
  }

  back = () => {
    this.emitter.trigger('pick-token:back')
  }

  _submit() {
    this.emitter.trigger('pick-token:submit', this.inputs.token.val())
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
            h2 Select a Token
            br
          Card.list-picker-wrapper
            MuiListPicker(
              ...this.inputs.token
              options=tokenOptions
            )
          br
          if this.getErrorMessage()
            .error
              = this.getErrorMessage()
          .picker-footer.columns
            .button.columns(onClick=this.back)
              ArrowBack
            .button(onClick=this.submit)
              | CONFIRM TOKEN
      `
  }
}
