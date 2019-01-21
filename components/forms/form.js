import React from 'react'
import ref from 'referential'
import toPromise from '../../src/util/toPromise'
import Emitter from '../../src/emitter'
import classnames from 'classnames'

export class InputData {
  static defaultProps = {
    data: ref({}),
    autoComplete: 'off'
  }

  constructor({ type, name, value, defaultValue, data, scrollToError, middleware }) {
    // Data context for storing control values outside of the state
    this.type = type || undefined
    // Name of field in data context
    this.name = name || ''
    // Data Context
    this.data = data || ref({})
    // Default starting value used to override null data values
    this.defaultValue = defaultValue
    this.value = this.data.get(this.name) || value || defaultValue || undefined
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

  val(v) {
    return this.emitter.trigger('control:value', v)[0]
  }

  value(v) {
    return val(v)
  }
}

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    // Hash array of InputDatas keyed by names
    this.inputs = {}

    this.state = {
      errorMessage: '',
      validating: false,
      loading: false,
      submitted: false
    }
  }

  componentWillUnmount() {
    for (let k in this.inputs) {
      this.inputs[k].emitter.off('control:submit')
      this.inputs[k].emitter.off('control:value')
    }
  }

  runMiddleware(rethrow) {
    this.setState({
      errorMessage: '',
      validating: true,
    })

    let inputs = []

    for (let k in this.inputs) {
      inputs.push(this.inputs[k])
    }

    let ps = inputs.map(i => {
      return i.emitter.trigger('control:submit')
    })

    return Promise.all([].concat.apply([], ps))
      .then(() => {
        this.setState({
          validating: false,
        })
      }).catch((err) => {
        let err2
        if (err) {
           err2 = new Error('Form Error: ' + err.message)
        }

        this.setState({
          validating: false,
          errorMessage: err2.message
        })

        if (rethrow) {
          throw err2
        }
      })
  }

  getErrorMessage() {
    return this.state.errorMessage || ''
  }

  submit = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (this.state.submitted) {
      return
    }

    this.setState({
      loading: true,
      submitted: false
    })

    return this.runMiddleware(true)
      .then(() => {
        let ret = this._submit()
        if (ret && ret.then) {
          return ret.then(() => {
            this.setState({
              loading: false,
              submitted: true
            })
          })
        }

        this.setState({
          loading: false,
          submitted: true
        })
      })
      .catch((err) => {
        this.setState({
          errorMessage: err.message,
          loading: false,
          submitted: false
        })
      })
  }

  _submit() {
    return new Promise((resolve) => { resolve(true) })
  }

  render() {
    return pug`
      form(
        autoComplete=this.props.autoComplete
        onSubmit=this.submit
        className=classnames({
          validating: this.state.validating,
          loading: this.state.loading,
          submitted: this.state.submitted,
        })
      )
        if this.state.loading || this.state.validating
          .progress
            .indeterminate
        = props.children
        if this.getErrorMessage()
          .error
            = this.getErrorMessage()

    `
  }
}
