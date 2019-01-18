import React from 'react'

import valueOrCall from '../../src/util/valueOrCall'

// Base control class
let controlId = 0

export default class Control extends React.Component {
  // Props should be
  constructor(props) {
    super(props)

    // Unique ID for referencing the control
    this.controlId = controlId++
    if (props.emitter) {
      props.emitter.on('form:submit', () => {
        return this._change(this.state.value, true)
      })

      props.emitter.on('input:value', (v) => {
        if (v != null) {
          this.props.data.set(this.props.name, v)
          this.setState({
            value: v
          })

          if (v != this.props.defaultValue) {
            this._change(v)
          }
        }
        return this.props.data.get(this.props.name)
      })
    }

    this.state = {
      value: props.value || props.defaultValue,
      valid: false,
      errorMessage: '',
      appIsMounted: false
    }

    if (props.value != props.defaultValue) {
      this._change(props.value)
    }

    this.inputRef = React.createRef()
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true })
    });
  }

  getId() {
    return this.props.type + '-' + controlId
  }

  getName() {
    return valueOrCall(this.props.name).replace(/\\./g, '-')
  }

  getValue(event) {
    let val = event.target.value
    if (val != null) {
      return val.trim()
    }

    return undefined
  }

  getText() {
    return this.state.value
  }

  getErrorMessage() {
    return this.state.errorMessage || ''
  }

  error(value, e) {
    this.setState({
      errorMessage: e,
      value: value,
      valid: false
    }, () => {
      if (this.props.scrollToError) {
        this.inputRef.current.scrollIntoView()
        this.inputRef.current.focus()
      }
    })
  }

  runMiddleware(value) {
    return Promise.all(this.props.middleware.map(m => {
      return m(this.state.value, value, this.name)
    }))
  }

  // Note, its atleast 2 characters (max savings unbounded) shorter to abuse ES6 automatic this binding syntax with => than adding explicit binds
  change = (event) => {
    this.setState({
      errorMessage: '',
      valid: false
    })
    this._change(this.getValue(event))
  }

  _change(value, rethrow) {
    return this.runMiddleware(value)
      .then(() => {
        this.changed(value)
      }).catch((err) => {
        this.error(value, err.message)
        if (rethrow) {
          throw err
        }
      })
  }

  changed(value) {
    this.props.data.set(this.props.name, value)
    this.setState({
      value: value,
      valid: true
    })
  }

  render() {
    let { value, errorMessage }  = this.state

    return pug`
      .input(ref=this.inputRef)
        .value
          = 'Value: ' + value
        if errorMessage
          .error
            = 'Error: ' + errorMessage`
  }
}
