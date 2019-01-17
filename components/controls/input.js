import Control from './control'
import classnames from 'classnames'

export default class Input extends Control {
  static defaultProps = {
    type: 'text',
    autocomplete: 'on',
    autofocus: undefined,
    disabled: undefined,
    maxlength: undefined,
    readonly: undefined,
    placeholder: '',
    label: '',
    instructions: ''
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
            valid: this.valid,
            labeled: props.label
          })
        )
          input(
            id=this.getId()
            name=this.getName()
            type=props.type
            onChange=this.change
            onBlur=this.change
            defaultValue=this.getText()
            autoComplete=props.autocomplete
            autoFocus=props.autofocus
            disabled=props.disabled
            maxlength=props.maxlength
            readOnly=props.readonly
            placeholder=props.placeholder
          )
        if props.label
          .label(
            className=classnames({
              active: this.getText() || props.placeholder
            })
          )
            = props.label
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        if props.instructions && !this.getErrorMessage()
          .helper
            = props.instructions`
  }
}
