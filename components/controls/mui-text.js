import React from 'react'

import control from './control'
import TextField from '@material-ui/core/TextField'

@control
export default class MUIText extends React.Component{
  static defaultProps = {
    type: 'text',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: undefined,
    maxLength: undefined,
    readOnly: undefined,
    placeholder: '',
    label: '',
    instructions: '',
    wrap: '',
    spellCheck: '',
    rows: undefined,
    cols: undefined,
    showErrors: true,
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
      ...props
    } = this.props

    value = value || defaultValue || ""

    return pug`TextField(
      ...props
      value=value
      helperText=errorMessage || instructions
      error=!!errorMessage
    )`
  }
}

