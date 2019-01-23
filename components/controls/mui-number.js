import React from 'react'

import control from './control'
import MuiText from './mui-text'
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
export default class MUINumber extends MuiText{
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

    value = value || defaultValue || ""

    let helper = instructions

    if(showErrors && errorMessage) {
      helper = errorMessage
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

