import Control from './control'

export default class Input extends Control {
  render() {
    return pug`
      .input-container(
        class='{invalid: errorMessage, valid: valid, labeled: label}'
      )
        input(
          id='{ getId() }'
          name='{ getName() }'
          type='{ type }'
          onchange='{ change }'
          onblur='{ change }'
          riot-value='{ getText() }'
          autocomplete='{ autocomplete }'
          autofocus='{ autofocus }'
          disabled='{ disabled }'
          maxlength='{ maxlength }'
          readonly='{ readonly }'
          placeholder='{ placeholder }'
        )
      .label(
        class='{ active: getText() || placeholder }'
        if='{ label }'
      )
        | { label }
      .error(if='{ errorMessage }')
        | { errorMessage }
      .helper(if='{ instructions && !errorMessage }')
        | { instructions }
    }
  }`
}
