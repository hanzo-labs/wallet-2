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
            valid: this.state.valid,
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
            autoComplete=props.autoComplete
            data-lpignore='true'
            autoFocus=props.autoFocus
            disabled=props.disabled
            maxlength=props.maxlength
            readOnly=props.readOnly
            placeholder=props.placeholder
          )
        if props.label
          .label(
            className=classnames({
              active: this.getText() || props.placeholder,
              'no-transition': !this.state.appIsMounted
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
