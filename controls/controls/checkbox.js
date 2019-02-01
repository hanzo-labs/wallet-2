import React from 'react'

import control from './control'
import classnames from 'classnames'

@control
export default class Checkbox extends React.Component{
  static defaultProps = {
    type: 'checkbox',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: undefined,
    maxLength: undefined,
    readOnly: undefined,
    placeholder: '',
    label: '',
    instructions: ''
  }

  constructor(props) {
    super(props)
  }

  getValue(e) {
    return e.target.checked
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
      label,
      ...props
    } = this.props

    value = value || defaultValue

    return pug`
      .checkbox
        .checkbox-container(
          className=classnames({
            invalid: !!errorMessage,
            valid: valid,
            labeled: label,
            checked: !!value,
          })
        )
          input(...props)
          label(for=props.id)
          if !!label
            .label.active
              = label
        if !!errorMessage
          .error
            = errorMessage
        if !!instructions && !errorMessage
          .helper
            = instructions
      `
  }
}
