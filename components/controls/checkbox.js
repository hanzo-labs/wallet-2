import Control from './control'
import classnames from 'classnames'

export default class Checkbox extends Control {
  static defaultProps = {
    type: 'checkbox',
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

  getValue(e) {
    return e.target.checked
  }

  render() {
    let props = this.props

    return pug`
      .checkbox(ref=this.inputRef)
        .checkbox-container(
          className=classnames({
            invalid: this.getErrorMessage(),
            valid: this.state.valid,
            labeled: props.label,
            checked: !!this.state.value
          })
        )
          input(
            id=this.getId()
            name=this.getName()
            type='checkbox'
            onClick=this.change
            onChange=this.change
            onBlur=this.change
            checked=!!this.state.value
          )
          label(for=this.getId())
          if props.label
            .label.active
              = props.label
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()
        if props.instructions && !this.getErrorMessage()
          .helper
            = props.instructions
      `
  }
}
