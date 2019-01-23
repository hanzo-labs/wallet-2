import Form, { InputData } from './form'
import Emitter from '../../src/emitter'
import MuiListPicker from '../../components/controls/mui-list-picker'
import TokenCard from '../../components/token-card'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { withStyles } from '@material-ui/core/styles'
import { watch } from '../../src/referential/provider'
import {
  generateNthEthereumKeys,
  generateNthEOSKeys,
} from '../../src/wallet'
import classnames from 'classnames'

const styles = theme => ({
  noMargin: {
    margin: 0,
  },
})

let addressOptions = {}

@watch('pickAddress')
class PickAddress extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      address: new InputData({
        name: 'address',
        data: props.data,
        value: '0',
        middleware: [(v) => {
          if (addressOptions[v]) {
            return v
          }

          throw Error('No address selected.')
        }],
      }),
    }

    let [ethAddress] = generateNthEthereumKeys(1)
    let [eosAddress] = generateNthEOSKeys(1)

    addressOptions[ethAddress.publicKey] = {
      label: ethAddress.publicKey,
      secondary: '10000.00 ($10000.00)',
    }

    addressOptions[eosAddress.publicKey] = {
      label: eosAddress.publicKey,
      secondary: '10000.00 ($10000.00)',
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
            ArrowUpward(style={ fontSize: 100 })
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

export default withStyles(styles)(PickAddress)
