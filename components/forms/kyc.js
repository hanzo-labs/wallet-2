import Form, { InputData } from './form'
import MuiText from '../../components/controls/mui-text'
import MuiPhone from '../../components/controls/mui-phone'
import MuiTaxId from '../../components/controls/mui-taxid'
import MuiDatePicker from '../../components/controls/mui-date-picker'
import MuiCountry from '../../components/controls/mui-country'
import MuiState from '../../components/controls/mui-state'
import WebcamCapture from '../../components/controls/webcam-capture'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'

import { watch } from '../../src/referential/provider'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'
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
        value: this.props.rootData.get('account.firstName'),
        middleware: [ isRequired ],
      }),
      middleName: new InputData({
        name: 'middleName',
        data: props.data,
      }),
      lastName: new InputData({
        name: 'lastName',
        data: props.data,
        value: this.props.rootData.get('account.lastName'),
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
        value: 'US',
        middleware: [ isRequired ],
      }),
      state: new InputData({
        name: 'kyc.address.state',
        data: props.data,
        value: 'CA',
        middleware: [ isRequired ],
      }),
      kycFace: new InputData({
        name: 'kyc.documents.0',
        data: props.data,
        middleware: [ isRequired ],
      }),
      kycIdFront: new InputData({
        name: 'kyc.documents.1',
        data: props.data,
        middleware: [ isRequired ],
      }),
      kycIdBack: new InputData({
        name: 'kyc.documents.2',
        data: props.data,
        middleware: [ isRequired ],
      }),
    }

    this.emitter = props.emitter || new Emitter()
  }

  componentDidMount() {
    this.props.data.set('kyc', this.props.rootData.get('account.kyc'))
  }

  _submit() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    let opts = this.props.data.get()
    opts.kyc.taxId = '' + opts.kyc.taxId
    opts.kyc.phone = '' + opts.kyc.phone

    return api.client.account.update(opts).then((res) => {
      this.emitter.trigger('kyc:success', res)
    })
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

        br
        p PHOTO IDS
        Card.photos
          CardContent.form-content
            .form-group.columns
              .photo
                WebcamCapture(...this.inputs.kycFace)
                div Face
              .photo
                WebcamCapture(
                  ...this.inputs.kycIdFront
                  videoConstraints={
                    facingMode: { exact: 'environment' }
                  }
                )
                div ID Front
              .photo
                WebcamCapture(
                  ...this.inputs.kycIdBack
                  videoConstraints={
                    facingMode: { exact: 'environment' }
                  }
                )
                div ID Back
        br
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()

        .button(onClick=this.submit)
          | CONTINUE
      `
  }
}

