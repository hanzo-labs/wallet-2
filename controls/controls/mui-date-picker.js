import React from 'react'

import control from './control'
import { BaseMUIText } from './mui-text'
import { InlineDatePicker } from 'material-ui-pickers'
import { MUIPickersContextConsumer } from 'material-ui-pickers'

import { defaultFormat, renderUIDate, renderJSONDate } from '../../src/util/date'
import moment from 'moment-timezone'

@control
export default class MUIDatePicker extends BaseMUIText{
  change = (e) => {
    if (this.props.onChange) {
      let v = renderJSONDate(e)

      this.props.onChange(v)
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

    value = value || defaultValue || moment()

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
    }

    return <MUIPickersContextConsumer>
      { (utils) => {
        return <InlineDatePicker
          { ...props }
          value={ moment(value) }
          keyboard
          utils={ utils }
          onChange={ this.change }
          format={ defaultFormat() }
          mask={ [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/] }
        />
      } }
    </ MUIPickersContextConsumer>
  }
}
