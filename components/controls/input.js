import Control from './control'
import classnames from 'classnames'

export default class Input extends Control {
  static defaultProps = {
    type: 'text',
    autoComplete: 'new-password',
    autoFocus: undefined,
    disabled: undefined,
    maxlength: undefined,
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

  render() {
    let props = this.props

    return pug`
      .input(ref=this.inputRef)
        .input-container(
          className=classnames({
            invalid: this.getErrorMessage(),
            valid: this.state.valid,
            labeled: props.label
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
