import React from 'react'
import Emitter from '../../src/emitter'
import classnames from 'classnames'

let emitter = new Emitter()

export let startLoading = (...args) => {
  return emitter.trigger('loader:start', ...args)
}

export let stopLoading = (...args) => {
  return emitter.trigger('loader:stop', ...args)
}

// catch any loading commands before initial render
let loading = true
let msg = ''

emitter.on('loader:start', (m) => {
  loading = true
  msg = m
})

emitter.on('loader:stop', (m) => {
  loading = false
  msg = m
})

export let loadable = (WrappedComponent) => {
  class LoadableComponent extends React.Component {
    render() {
      let props = this.props
      let newProps = {}

      for (let key in props) {
        if (this.props.hasOwnProperty(key)) {
          newProps[key] = props[key]
        }
      }

      newProps.startLoading = startLoading
      newProps.stopLoading = stopLoading

      return <WrappedComponent {...newProps} />
    }
  }

  return LoadableComponent
}

export default class Loader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: loading,
      unloading: false,
      msg: msg,
    }

    emitter.on('loader:start', (msg) => {
      this.setState({
        loading: true,
        unloading: false,
        msg: msg,
      })
    })

    emitter.on('loader:stop', (msg) => {
      if (!this.state.unloading) {
        setTimeout(() => {
          this.setState({
            loading: false,
            unloading: false,
            msg: msg,
          })
        }, 650)
      }

      this.setState({
        unloading: true,
      })
    })
  }

  render() {
    return pug`
      .app-loader.columns(
        className=classnames({
          loading: this.state.loading,
          unloading: this.state.unloading,
        })
      )
        if this.state.loading
          .content
            h4.app-loader-message
              = this.state.msg || 'Loading...'
      `
  }
}
