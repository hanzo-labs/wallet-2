import Form, { InputData } from './form'
import Emitter from '../../src/emitter'
import MuiText from '../../components/controls/mui-text'
import MuiPhone from '../../components/controls/mui-phone'
import MuiTaxId from '../../components/controls/mui-taxid'
import MuiDatePicker from '../../components/controls/mui-date-picker'
import MuiCountry from '../../components/controls/mui-country'
import MuiState from '../../components/controls/mui-state'
import Webcam from '../../components/controls/webcam'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import { watch } from '../../src/referential/provider'
import classnames from 'classnames'

import isRequired from '../../src/control-middlewares/isRequired'
import isPhone from '../../src/control-middlewares/isPhone'

let genderOpts = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  unspecified: 'Unspecified',
}

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
      taxId: new InputData({
        name: 'kyc.taxId',
        data: props.data,
        middleware: [ isRequired ],
      }),
      birthdate: new InputData({
        name: 'kyc.birthdate',
        data: props.data,
        middleware: [ isRequired ],
      }),
      gender: new InputData({
        name: 'kyc.gender',
        data: props.data,
        value: 'unspecified',
        middleware: [ isRequired ],
        options: genderOpts,
      }),
      addressLine1: new InputData({
        name: 'kyc.address.line1',
        data: props.data,
        middleware: [ isRequired ],
      }),
      addressLine2: new InputData({
        name: 'kyc.address.line2',
        data: props.data,
      }),
      city: new InputData({
        name: 'kyc.address.city',
        data: props.data,
        middleware: [ isRequired ],
      }),
      postalCode: new InputData({
        name: 'kyc.address.postalCode',
        data: props.data,
        middleware: [ isRequired ],
      }),
      country: new InputData({
        name: 'kyc.address.country',
        data: props.data,
        value: 'us',
        middleware: [ isRequired ],
      }),
      state: new InputData({
        name: 'kyc.address.state',
        data: props.data,
        value: 'ca',
        middleware: [ isRequired ],
      }),
    }

    this.emitter = props.emitter
  }

  render() {
    let { classes } = this.props

    return pug`
      form.form(
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
          CardContent.form-content
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
              MuiTaxId(
                ...this.inputs.taxId
                label='SSN'
                variant='outlined'
              )
            .form-group.columns
              MuiDatePicker(
                ...this.inputs.birthdate
                label='Birthday'
                variant='outlined'
              )
              MuiText(
                ...this.inputs.gender
                label='Gender'
                variant='outlined'
              )
        br
        p PRIMARY ADDRESS
        Card
          CardContent.form-content
            .form-group.columns
              MuiText(
                ...this.inputs.addressLine1
                label='Street Address'
                variant='outlined'
              )
            .form-group.columns
              MuiText(
                ...this.inputs.addressLine2
                label='Apartment/Suite Number'
                variant='outlined'
              )
            .form-group.columns
              MuiText.flex3(
                ...this.inputs.city
                label='City'
                variant='outlined'
              )
              MuiText.flex2(
                ...this.inputs.postalCode
                label='Postal Code'
                variant='outlined'
              )
            .form-group.columns
              MuiCountry(
                ...this.inputs.country
                label='Country'
                variant='outlined'
              )
              MuiState(
                ...this.inputs.state
                label='State'
                variant='outlined'
                country=this.inputs.country.val()
              )

        p PHOTO IDS
        Card
          CardContent.form-content
            .form-group.columns
              Webcam
        br
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()

        .button(onClick=this.submit)
          | CONTINUE
      `
  }
}
