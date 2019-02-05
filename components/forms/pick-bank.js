import Form, {
  Emitter,
  InputData,
  MuiListPicker,
} from 'react-referential-forms'
import TokenCard from '../../components/token-card'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import AccountBalance from '@material-ui/icons/AccountBalance'
import ArrowBack from '@material-ui/icons/ArrowBack'
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import classnames from 'classnames'

const styles = theme => ({
  noMargin: {
    margin: 0,
  },
})

let bankOptions = {
  '0': {
    label: 'First Demo Bank',
    secondary: 'Account ending in 1234',
    icon: AccountBalance,
  },
}

@watch('pickBank')
class PickBank extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      bank: new InputData({
        name: 'bank',
        data: props.data,
        value: '0',
        middleware: [(v) => {
          if (bankOptions[v]) {
            return v
          }

          throw Error('No bank selected.')
        }],
      }),
    }

    this.emitter = props.emitter
  }

  back = () => {
    this.emitter.trigger('pick-bank:back')
  }

  _submit() {
    this.emitter.trigger('pick-bank:submit', this.inputs.bank.val())
  }

  render() {
    let { classes } = this.props

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
            h2 Select a Bank
            br
          Card.list-picker-wrapper
            MuiListPicker(
              ...this.inputs.bank
              options=bankOptions
            )
              ListItem(
                button
              )
                ListItemIcon(className=classes.noMargin)
                  AddCircleOutlined(style={ fontSize: 36 })
                ListItemText
                  | Add a Bank Account
          br
          if this.getErrorMessage()
            .error
              = this.getErrorMessage()
          .picker-footer.columns
            .button.columns(onClick=this.back)
              ArrowBack
            .button(onClick=this.submit)
              | CONFIRM BANK
      `
  }
}

export default withStyles(styles)(PickBank)
