import Form, {
  InputData,
  MuiText,
  MuiCheckbox,
} from 'react-referential-forms'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import ref from 'referential'
import classnames from 'classnames'
import * as ethers from 'ethers'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'

import { watch } from 'react-referential'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

import isRequired from '../../src/control-middlewares/isRequired'
import isEmail from '../../src/control-middlewares/isEmail'
import isPassword from '../../src/control-middlewares/isPassword'
import matches from '../../src/control-middlewares/matches'

@watch('loginForm')
export default class LoginForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      firstName: new InputData({
        name: 'firstName',
        data: props.data,
        middleware: [ isRequired ],
      }),
      lastName: new InputData({
        name: 'lastName',
        data: props.data,
        middleware: [ isRequired ],
      }),
      email: new InputData({
        name: 'email',
        data: props.data,
        middleware: [isRequired, isEmail]
      }),
      password: new InputData({
        name: 'password',
        middleware: [isRequired, isPassword]
      }),
      passwordConfirm: new InputData({
        name: 'passwordConfirm',
        middleware: [isRequired, isPassword,
          matches(() => {
            return this.inputs.password.val()
          }, 'passwords')
        ]
      }),
      over18: new InputData({
        name: 'rememberMe',
        data: props.data,
        defaultValue: false,
        middleware: [isRequired]
      })
    }

    this.emitter = props.emitter || new Emitter()
  }

  _submit() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    return api.client.account.create({
      email: this.inputs.email.val(),
      firstName: this.inputs.firstName.val(),
      lastName: this.inputs.lastName.val(),
      password: this.inputs.password.val(),
      passwordConfrim: this.inputs.passwordConfirm.val(),
    }).then((res) => {
      let p = this.inputs.password.val()

      this.inputs.password.val(this.inputs.password.val().replace(/./g, '•'))

      let i = this.inputs.email.val() + p

      this.emitter.trigger('login:success', {
        identity: ethers.utils.sha256(ethers.utils.toUtf8Bytes(i)),
        token: res.token,
      })
    })
  }

  render() {
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
        .form-group.columns
          MuiText(
            ...this.inputs.firstName
            label='First Name'
            variant='outlined'
          )
          MuiText(
            ...this.inputs.lastName
            label='Last Name'
            variant='outlined'
          )
        .form-group.columns
          MuiText(
            ...this.inputs.email
            label='Email'
            variant='outlined'
          )
        .form-group.columns
          MuiText(
            ...this.inputs.password
            label='Password'
            type='password'
            variant='outlined'
          )
        .form-group.columns
          MuiText(
            ...this.inputs.passwordConfirm
            label='Confirm Password'
            type='password'
            variant='outlined'
          )
        MuiCheckbox(
          ...this.inputs.over18
          label='I am over 18.'
        )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        Button.button(type='submit')
          | REGISTER
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
