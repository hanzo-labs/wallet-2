import React from 'react'

import valueOrCall from '../../src/util/valueOrCall'
import classnames from 'classnames'

// Base control class
let controlId = 0

export default function control(ControlComponent) {
  return class Control extends React.Component {
    // Props should be
    constructor(props) {
      super(props)

      // Unique ID for referencing the control
      this.controlId = controlId++

      props.emitter.unique('control:submit', () => {
        return this._change(this.state.value, true)
      })

      // emitter.off to force any duplicate unmounted inputs out of scope
      props.emitter.unique('control:value', (v) => {
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

    componentWillUnmount() {
      // These are unbound on the form level
      // this.props.emitter.off('control:submit')
      // this.props.emitter.off('control:value')
    }

    getId() {
      return 'control-' + this.controlId
    }

    getName() {
      return valueOrCall(this.props.name).replace(/\\./g, '-')
    }

    getValue(event) {
      let val = event.target.value
      if (val != null) {
        return val
      }

      return ''
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
      // need to replace with actual middleware stack
      let [p, ...middleware] = this.props.middleware

      if (!p) {
        return new Promise((resolve) => {
          resolve(value)
        })
      }

      let oldValue = this.state.value
      let name = this.name

      p = p(value, oldValue, name)

      for(let k in middleware) {
        let m = middleware[k]

        p = p.then((v) => {
          return new Promise((resolve, reject)=> {
            m(v, oldValue, name).then((v) => {
              resolve(v)
            }).catch((err) => {
              reject(err)
            })
          })
        })
      }

      return p
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
      // trim the value we run the middleware on
      let valueTrimmed = value

      if (typeof valueTrimmed == 'string') {
        valueTrimmed = value.trim()
      }

      return this.runMiddleware(valueTrimmed)
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
      // we also store the trimmed value
      let valueTrimmed = value

      if (typeof valueTrimmed == 'string') {
        valueTrimmed = value.trim()
      }

      this.props.data.set(this.props.name, valueTrimmed)
      this.setState({
        value: value,
        valid: true,
      })
    }

    render() {
      let {
        value,
        valid,
        errorMessage,
      }  = this.state

      let props = Object.assign({}, this.props, {
        id: this.getId(),
        name: this.getName(),
        onChange: this.change,
      })

      delete props.value

      return pug`
        .control(
          ref=this.inputRef
          className=classnames({
            valid: valid,
            invalid: !!errorMessage,
          })
        )
          ControlComponent(
            ...props
            value=value
            valid=valid
            errorMessage=errorMessage
          )
        `
    }
  }
}

