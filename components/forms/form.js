import React from 'react'
import ref from 'referential'
import toPromise from '../../src/util/toPromise'
import Emitter from '../../src/util/emitter'

export class InputData {
  static defaultProps = {
    data: ref({}),
    autoComplete: 'off'
  }

  constructor({ type, name, defaultValue, data, scrollToError, middleware }) {
    // Data context for storing control values outside of the state
    this.type = type || undefined
    // Name of field in data context
    this.name = name || ''
    // Data Context
    this.data = data || ref({})
    // Default starting value used to override null data values
    this.value = this.data.get(this.name) || defaultValue || undefined
    if (this.value != this.data.get(this.name)) {
      this.data.set(this.name, this.value)
    }

    // Should the page scroll to an error in the middleware?
    this.scrollToError = scrollToError || true

    // List of middleware
    // in the form of (newValue, oldValue, name) => {}
    // where
    //       newValue is the new value of the control
    //       oldValue is the old value of the control
    //       name is the name of the control
    this.middleware = middleware || []
    this.middleware = this.middleware.map(m => {
      if (m.isPromise) {
        return m
      }

      return toPromise(m)
    })

    this.emitter = new Emitter()
  }
}

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    // Hash array of InputDatas keyed by names
    this.inputs = {}

    this.state = {
      errorMessage: '',
      submitted: false
    }
  }

  runMiddleware() {
    let ps = []

    for (let k in this.inputs) {
      ps.push(this.inputs[k].emitter.trigger('form:runMiddleware'))
    }

    ps = [].concat.apply([], ps)

    return Promise.all(ps)
  }

  submit = () => {
    this.setState({
      submitted: true
    })

    return this.runMiddleware()
      .then(this._submit)
      .catch((err) => {
        this.setState(this.state, {
          errorMessage: err,
          submitted: false
        })
      })
  }

  _submit() {
    return new Promise((resolve) => { resolve(true) })
  }

  render() {
    return pug`
      form(autoComplete=this.props.autoComplete onClick=this.submit)
        = props.children`
  }
}
