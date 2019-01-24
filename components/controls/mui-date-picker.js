import React from 'react'

import control from './control'
import MuiText from './mui-text'
import { InlineDatePicker } from 'material-ui-pickers'
import { MuiPickersContextConsumer } from 'material-ui-pickers'

@control
export default class MUIDatePicker extends MuiText{
  change = (e) => {
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  }

  render() {
    let {
      data,
      emitter,
      showErrors,
      scrollToError,
      value,
      defaultValue,
      valid,
      errorMessage,
      middleware,
      instructions,
      InputProps,
      ...props
    } = this.props

    props.onChange = this.change

    value = value || defaultValue || ""

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
    }

    return <MuiPickersContextConsumer>
      { (utils) => {
        return <InlineDatePicker
          { ...props }
          keyboard
          utils={ utils }
          defaultValue={ value }
          onChange={ this.change }
          format={ 'MM/DD/YYYY' }
          mask={ [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] }
        />
      } }
    </ MuiPickersContextConsumer>
  }
}
