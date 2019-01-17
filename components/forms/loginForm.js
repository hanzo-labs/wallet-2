import Form, { InputData } from './form'
import ref from 'referential'
import Input from '../controls/input'
import { watch } from '../../src/referential/watch'

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
        data: ref({}),
        middleware: [isRequired, isPassword]
      })
    }
  }

  _submit() {
    return new Promise((resolve) => { resolve(true) })
    this.props.data.password = ''
  }

  render() {
    return pug`
      form(autoComplete=this.props.autoComplete onClick=this.submit)
        Input(
          ...this.inputs.email
          label='Email'
        )
        Input(
          ...this.inputs.password
          label='Password'
          type='password'
        )`
  }
}
