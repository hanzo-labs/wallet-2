import React from 'react'

import control from './control'
import InputBase from '@material-ui/core/InputBase'
import MenuItem from '@material-ui/core/MenuItem'

export class BaseMUIInput extends React.Component{
  static defaultProps = {
    type: 'text',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: undefined,
    maxLength: undefined,
    readOnly: undefined,
    placeholder: '',
    instructions: '',
    wrap: '',
    spellCheck: '',
    rows: undefined,
    cols: undefined,
    options: undefined,
    changeNotBlur: false,
  }

  constructor(props) {
    super(props)
  }

  render() {
    let {
      data,
      emitter,
      value,
      defaultValue,
      valid,
      middleware,
      disabled,
      onChange,
      errorMessage,
      scrollToError,
      changeNotBlur,
      ...props
    } = this.props

    if (!disabled) {
      disabled = this.disabled
    }

    value = value || defaultValue || ""

    return pug`
      InputBase(
        ...props
        disabled=disabled
        defaultValue=value
        onBlur=changeNotBlur ? undefined : onChange
        onChange=changeNotBlur ? onChange : undefined
      )
      `
  }
}

@control
export default class MUIInput extends BaseMUIInput {}
