import React from 'react'

import control from './control'
import classnames from 'classnames'

@control
export default class Input extends React.Component{
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

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true })
    });
  }

  render() {
    let {
      data,
      rootData,
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

    value = value || defaultValue || ""

    return pug`
      .input
        .input-container(
          className=classnames({
            invalid: !!errorMessage,
            valid: valid,
            labeled: label
          })
        )
          if !props.rows
            input(...props value=value)
          else
            textarea(...props value=value)
        if !!label
          .label(
            className=classnames({
              active: value || props.placeholder,
              'no-transition': !this.state.appIsMounted
            })
          )
            = label
        if !!errorMessage && showErrors
          .error
            = errorMessage
        if !!instructions && !errorMessage
          .helper
            = instructions
    `
  }
}
