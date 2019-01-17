import Form, { InputData } from './form'
import Input from '../controls/input'

import isRequired from '../../src/control-middlewares/isRequired'
import isEmail from '../../src/control-middlewares/isEmail'
import isPassword from '../../src/control-middlewares/isPassword'

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
        data: props.data,
        middleware: [isRequired, isPassword]
      })
    }
  }

  _submit() {
    return new Promise((resolve) => { resolve(true) })
  }

  render() {
    return pug`
      form(onClick=this.submit)
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
