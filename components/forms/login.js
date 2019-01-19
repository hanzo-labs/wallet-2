import Form, { InputData } from './form'
import Input from '../controls/input'
import Checkbox from '../controls/checkbox'

import ref from 'referential'
import classnames from 'classnames'
import * as ethers from 'ethers'
import Api from '../../src/hanzo/api'
import Emitter from '../../src/emitter'

import { watch } from '../../src/referential/watch'
import { HANZO_KEY, HANZO_ENDPOINT } from '../../src/settings.js'

import isRequired from '../../src/control-middlewares/isRequired'
import isEmail from '../../src/control-middlewares/isEmail'
import isPassword from '../../src/control-middlewares/isPassword'

@watch('loginForm')
export default class LoginForm extends Form {
  constructor(props) {
    super(props)

    this.inputs = {
      email: new InputData({
        name: 'email',
        data: props.data,
        middleware: [isRequired, isEmail]
      }),
      password: new InputData({
        name: 'password',
        middleware: [isRequired, isPassword]
      }),
      rememberMe: new InputData({
        name: 'rememberMe',
        data: props.data,
        defaultValue: false
      })
    }

    this.emitter = props.emitter || new Emitter()
  }

  _submit() {
    let api = new Api( HANZO_KEY, HANZO_ENDPOINT )

    return api.client.account.login({
      email: this.inputs.email.val(),
      password: this.inputs.password.val(),
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
        Input(
          ...this.inputs.email
          placeholder='Email'
        )
        Input(
          ...this.inputs.password
          placeholder='Password'
          type='password'
        )
        Checkbox(
          ...this.inputs.rememberMe
          label='Remember me on this device.'
        )
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        button.button(type='submit')
          | LOGIN
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
    `
  }
}
