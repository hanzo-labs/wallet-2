import Input from './input'
import classnames from 'classnames'

export default class Copy extends Input {
  static defaultProps = {
    type: 'text',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: true,
    maxlength: undefined,
    readOnly: undefined,
    placeholder: '',
    label: '',
    instructions: '',
    wrap: '',
    spellcheck: '',
    rows: undefined,
    cols: undefined,
  }

  constructor(props) {
    super(props)

    this.state.copied = false

    props.emitter.on('copy:copy', () => {
      this.copy()
    })
  }

  copy() {
    let text = this.getText()

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
      msg = successful ? 'successful' : 'unsuccessful'
      console.log('Copying text command was ' + msg)
    } catch (err) {
      console.log('Oops, unable to copy')
    }

    document.body.removeChild(textArea)
  }

  render() {
    let props = this.props

    return pug`
      .input(ref=this.inputRef)
        .input-container(
          className=classnames({
            invalid: this.getErrorMessage(),
            valid: this.state.valid,
            labeled: props.label,
            copied: this.state.copied,
          })
        )
          if !props.rows
            input(
              id=this.getId()
              name=this.getName()
              type=props.type
              onChange=this.change
              onBlur=this.change
              value=this.getText()
              autoComplete=props.autoComplete
              data-lpignore='true'
              autoFocus=props.autoFocus
              disabled=props.disabled
              maxlength=props.maxlength
              readOnly=props.readOnly
              placeholder=props.placeholder
            )
          else
            textarea(
              id=this.getId()
              name=this.getName()
              type=props.type
              onChange=this.change
              onBlur=this.change
              value=this.getText()
              autoComplete=props.autoComplete
              data-lpignore='true'
              autoFocus=props.autoFocus
              disabled=props.disabled
              maxlength=props.maxlength
              readOnly=props.readOnly
              placeholder=props.placeholder
              wrap=props.wrap
              spellCheck=props.spellCheck
              rows=props.rows
              cols=props.cols
            )
        if props.label
          .label(
            className=classnames({
              active: this.getText() || props.placeholder,
              'no-transition': !this.state.appIsMounted
            })
          )
            = props.label
        if this.getErrorMessage() && props.showErrors
          .error
            = this.getErrorMessage()
        if props.instructions && !this.getErrorMessage()
          .helper
            = props.instructions
    `
  }
}
