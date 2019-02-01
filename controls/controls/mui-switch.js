import React from 'react'

import control from './control'
import Switch from '@material-ui/core/Switch'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormHelperText from '@material-ui/core/FormHelperText'

import { withStyles } from '@material-ui/core/styles'

@control
export class BaseMUISwitch extends React.Component{
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

  change = (e, checked) => {
    if (this.props.onChange) {
      this.props.onChange(checked)
    }
  }

  constructor(props) {
    super(props)
  }

  render() {
    let {
      id,
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
      onChange,
      children,
      classes,
      label,
      ...props
    } = this.props

    if (!disabled) {
      disabled = this.disabled
    }

    value = value || defaultValue || false

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
    }

    return pug`
      .checkbox
        FormControl(className=classes.row)
          Switch(
            ...props
            id=id
            disabled=disabled
            checked=value
            onChange=this.change
            className=classes.pointer
            type='checkbox'
          )
          FormLabel(
            htmlFor=id
            className=classes.label
          )
            =label || children
          if !!helper
            FormHelperText(
              disabled=disabled
              error=!!errorMessage
              className=classes.helper
            )
              =helper
      `
  }
}

const styles = theme => ({
  pointer: {
    cursor: 'pointer',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  label: {
    textAlign: 'left',
    cursor: 'pointer',
  },
  helper: {
    flex: '0 1 100%',
  },
})

export default withStyles(styles)(class MUISwitch extends BaseMUISwitch {})
