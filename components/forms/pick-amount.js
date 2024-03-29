import Form, {
  Emitter,
  InputData,
  MuiNumber
} from 'react-referential-forms'
import TokenCard from '../../components/token-card'
import InputAdornment from '@material-ui/core/InputAdornment'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import AccountBalance from '@material-ui/icons/AccountBalance'
import ArrowBack from '@material-ui/icons/ArrowBack'
import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined'
import Button from '@material-ui/core/Button'

import { withStyles } from '@material-ui/core/styles'
import { watch } from 'react-referential'
import classnames from 'classnames'

const styles = theme => ({
  fullWidth: {
    width: '100%',
  },
})

@watch('pickAmount')
class PickAmount extends Form {
  static defaultProps = {
    showErrors: true,
    navMultiplier: 1,
  }

  constructor(props) {
    super(props)

    this.inputs = {
      amount: new InputData({
        name: 'amount',
        data: props.data,
        value: 1,
        middleware: [(v) => {
          let val = parseFloat(v)
          if (!isNaN(val) && val > 0) {
            return val
          }

          throw Error('Invalid amount.')
        }],
      }),
    }

    this.emitter = props.emitter
  }

  back = () => {
    this.emitter.trigger('pick-amount:back')
  }

  _submit() {
    this.emitter.trigger('pick-amount:submit', this.inputs.amount.val())
    console.log('lol?')
  }

  render() {
    let { classes } = this.props

    let val = this.inputs.amount.val() || 0
    if (typeof val == 'string') {
      val = val.replace(/[^0-9\.]+/g, '')
    }
    val = parseFloat(val)

    let nav = pug`
      InputAdornment.adornment(position='end') NAV
    `

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
            h2 Select an Amount
            br
          Card.list-picker-wrapper
            MuiNumber(
              ...this.inputs.amount
              className=classes.fullWidth
              showErrors=false
              InputProps={
                endAdornment: nav
              }
            )
          p.right
            = '' + (val * this.props.navMultiplier) + ' Hanzo UST based on Net Asset Value'
          br
          if this.getErrorMessage()
            .error
              = this.getErrorMessage()
          .picker-footer.columns
            .button.columns(onClick=this.back)
              ArrowBack
            .button(onClick=this.submit)
              | CONFIRM AMOUNT
      `
  }
}

export default withStyles(styles)(PickAmount)

