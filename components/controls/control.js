import React from 'react'
import mutate from '../../src/util/mutate'
import ref from 'referential'

import Promise from 'broken'
import isPromise from '../../src/util/isPromise'
import toPromise from '../../src/util/toPromise'

import valueOrCall from '../../src/util/valueOrCall'

// Base control class
let controlId = 0

export default class Control extends React.Component {
  // Control Type
  type: ''

  // Control Name
  name: ''

  constructor(props) {
    super(props)

    // Unique ID for referencing the control
    props.controlId = controlId++
    props.type = props.type || this.type
    props.name = props.name || this.name
    // Data context for storing control values outside of the state
    props.data = props.data || ref({})
    // Does the control scroll to the error?
    props.scrollToError = props.scrollToError || true
    // List of predicate middleware
    // in the form of (name, oldValue, newValue) => {}
    // where name is the name of the control
    //       oldValue is the old value of the control
    //       newValue is the new value of the control
    props.middleware = props.middleware || []

    props.middleware = props.middleware.map(m => {
      if (m.isPromise) {
        return m
      }

      p = toPromise(m)
      return p
    })

    this.state = {
      value: props.value || '',
      errorMessage: ''
    }

    this.inputRef = React.createRef()
  }

  getId() {
    let { type, controlId } = this.props
    return type + '-' + controlId
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

  error(e) {
    this.setState(mutate(this.state, {
      errorMessage: e
    }), () => {
      if (this.props.scrollToError) {
        this.inputRef.current.scrollIntoView()
        this.inputRef.current.focus()
      }
    })
  }

  change(event) {
    this.setState(mutate(this.state, {
      errorMessage: ''
    }))
    this._change(this.getValue(event))
  }

  _change(value) {
    ps = props.middleware.map(m => {
      return m(this.name, this.state.value, value)
    })

    Promise.all(ps).then(() => {
      this.changed(value)
    }).catch((e) => {
      this.error(e)
    })
  }

  changed(value) {
    this.props.data.set('name', value)
    this.setState(mutate(this.state, {
      value: value
    })
  }

  render() {
    let { value, errorMessage }  = this.state

    return pug`
      div.input(ref=this.inputRef)
        .value
          = 'Value: ' + value
        if errorMessage
          .error
            = 'Error: ' + errorMessage
    `
  }
}
