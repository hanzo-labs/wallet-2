import React from 'react'

import control from './control'
import { BaseMUIText } from './mui-text'
import TextField from '@material-ui/core/TextField'
import NumberFormat from 'react-number-format'

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      prefix='$'
    />
  );
}

@control
export default class MUINumber extends BaseMUIText{
  change = (e) => {
    let v = e
    if (e && e.target && e.target.value) {
      v = parseFloat(e.target.value.replace(/[^0-9\.]+/g, ''))
    }

    if (v.replace) {
      v = v.replace(/[^0-9\.]+/g, '')
    }

    if (this.props.onChange) {
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

    value = value || defaultValue || ""

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
    }

    if (!InputProps) {
      InputProps = {}
    }

    InputProps.inputComponent = NumberFormatCustom

    return pug`TextField(
      ...props
      defaultValue=value
      helperText=helper
      error=!!errorMessage
      InputProps=InputProps
    )`
  }
}

