import React from 'react'
import mutate from '../../src/util/mutate'

import isPromise from '../../src/util/isPromise'
import toPromise from '../../src/util/toPromise'

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
      props.emitter.on('form:runMiddleware', ()=> {
        return this.runMiddleware(this.props.value)
      })
    }

    this.state = {
      value: props.value || props.defaultValue,
      valid: false,
      errorMessage: ''
    }

    if (props.value != props.defaultValue) {
      this._change(props.value)
    }

    this.inputRef = React.createRef()
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

  error(e) {
    this.setState(mutate(this.state, {
      errorMessage: e,
      valid: false
    }), () => {
      if (this.props.scrollToError) {
        this.inputRef.current.scrollIntoView()
        this.inputRef.current.focus()
      }
    })
  }

  runMiddleware(value) {
    return this.props.middleware.map(m => {
      return m(this.state.value, value, this.name)
    })
  }

  change = (event) => {
    this.setState(mutate(this.state, {
      errorMessage: '',
      valid: false
    }))
    this._change(this.getValue(event))
  }

  _change(value) {
    Promise.all(this.runMiddleware(value)).then(() => {
      this.changed(value)
    }).catch((e) => {
      this.error(e.message)
    })
  }

  changed(value) {
    this.props.data.set('name', value)
    this.setState(mutate(this.state, {
      value: value,
      valid: true
    }))
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
