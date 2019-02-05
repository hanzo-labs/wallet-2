import Form, {
  Emitter,
  InputData,
  MuiText,
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
import isRequired from '../../src/control-middlewares/isRequired'

const styles = theme => ({
  fullWidth: {
    width: '100%',
  },
})

@watch('pickReceiver')
class PickReceiver extends Form {
  static defaultProps = {
    showErrors: true,
    navMultiplier: 1,
  }

  constructor(props) {
    super(props)

    this.inputs = {
      receiver: new InputData({
        name: 'receiver',
        data: props.data,
        value: '',
        middleware: [isRequired],
      }),
    }

    this.emitter = props.emitter
  }

  back = () => {
    this.emitter.trigger('pick-receiver:back')
  }

  _submit() {
    this.emitter.trigger('pick-receiver:submit', this.inputs.receiver.val())
    console.log('lol?')
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
            h2 Select a Destination
            br
          Card.list-picker-wrapper
            MuiText(
              ...this.inputs.receiver
              className=classes.fullWidth
              showErrors=false
            )
          br
          if this.getErrorMessage()
            .error
              = this.getErrorMessage()
          .picker-footer.columns
            .button.columns(onClick=this.back)
              ArrowBack
            .button(onClick=this.submit)
              | CONFIRM
      `
  }
}

export default withStyles(styles)(PickReceiver)

