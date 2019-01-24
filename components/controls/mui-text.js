import React from 'react'

import control from './control'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

export class BaseMUIText extends React.Component{
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
    options: undefined,
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
      options,
      disabled,
      ...props
    } = this.props

    if (!options) {
      options = this.options
    }

    if (!disabled) {
      disabled = this.disabled
    }

    value = value || defaultValue || ""

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
    }

    let isSelect = props.select != null && !!options
    let selectOptions = []
    if (isSelect) {
      if (props.SelectProps && props.SelectProps.native) {
        for (let k in options) {
          ((key) => {
            let opt = options[key]
            selectOptions.push(pug`
              option(key=key value=key)
                =opt
            `)
          })(k)
        }
      } else {
        for (let k in options) {
          ((key) => {
            let opt = options[key]
            selectOptions.push(pug`
              MenuItem(key=key value=key)
                =opt
            `)
          })(k)
        }
      }
    }

    return pug`
      TextField(
        ...props
        disabled=disabled
        value=value
        helperText=helper
        error=!!errorMessage
      )
        =selectOptions
      `
  }
}

@control
export default class MUIText extends BaseMUIText {}
