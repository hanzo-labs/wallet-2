import React from 'react'

import control from './control'
import classnames from 'classnames'

@control
export default class Copy extends React.Component{
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

    this.state = {
      copied: false
    }

    props.emitter.on('copy:copy', () => {
      this.copy()
    })
  }

  copy() {
    let text = this.props.value

    let textArea = document.createElement('textarea')
    textArea.contentEditable = true
    textArea.readOnly = false
    textArea.style.position = 'fixed'
    textArea.style.top = 0
    textArea.style.left = 0
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = 0
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()

    try {
      let range = document.createRange()
      let s = window.getSelection()
      s.removeAllRanges()
      s.addRange(range)
      textArea.setSelectionRange(0, 999999)

      let successful = document.execCommand('copy')
      let msg = successful ? 'successful' : 'unsuccessful'
      console.log('Copying text command was ' + msg)
    } catch (err) {
      console.log('Oops, unable to copy')
    }

    document.body.removeChild(textArea)
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true })
    });
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

    value = value || defaultValue || ""

    return pug`
      .input
        .input-container(
          className=classnames({
            invalid: !!errorMessage,
            valid: valid,
            labeled: label,
            copied: this.state.copied,
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
