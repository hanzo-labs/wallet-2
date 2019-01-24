import Form, { InputData } from './form'
import Emitter from '../../src/emitter'
import MuiText from '../../components/controls/mui-text'
import MuiPhone from '../../components/controls/mui-phone'
import MuiDatePicker from '../../components/controls/mui-date-picker'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import { watch } from '../../src/referential/provider'
import classnames from 'classnames'

import isRequired from '../../src/control-middlewares/isRequired'
import isPhone from '../../src/control-middlewares/isPhone'

@watch('kycForm')
export default class KYCForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      firstName: new InputData({
        name: 'firstName',
        data: props.data,
        middleware: [ isRequired ],
      }),
      middleName: new InputData({
        name: 'middleName',
        data: props.data,
      }),
      lastName: new InputData({
        name: 'lastName',
        data: props.data,
        middleware: [ isRequired ],
      }),
      phone: new InputData({
        name: 'kyc.phone',
        data: props.data,
        middleware: [ isRequired, isPhone ],
      }),
      birthday: new InputData({
        name: 'kyc.birthdate',
        data: props.data,
        middleware: [ isRequired ],
      }),
    }

    this.emitter = props.emitter
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
        h5 Please verify your identity.
        p Because Theseus interacts directly with your bank, regulators have asked that we collect identity information. Your data is cryptographically secured and sent only to Hanzo's banking endpoint.
        br
        p PERSONAL DETAILS
        Card
          CardContent
            .form-group.columns
              MuiText.flex2(
                ...this.inputs.firstName
                label='First Name'
                variant='outlined'
              )
              MuiText(
                ...this.inputs.middleName
                label='Middle Name'
                variant='outlined'
              )
              MuiText.flex2(
                ...this.inputs.lastName
                label='Last Name'
                variant='outlined'
              )
            .form-group.columns
              MuiPhone(
                ...this.inputs.phone
                label='Phone'
                variant='outlined'
              )
              MuiDatePicker(
                ...this.inputs.birthdate
                label='Birthday'
                variant='outlined'
              )

        if this.getErrorMessage()
          .error
            = this.getErrorMessage()

        .button(onClick=this.submit)
          | CONTINUE
      `
  }
}

