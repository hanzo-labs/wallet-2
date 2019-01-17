import React from 'react'
import { getData } from './provider'

export var watch = (key) => {
  return (WrappedComponent) => {
    class WatchedComponent extends React.Component {
      render() {
        let props = this.props
        let newProps = {}

        for (let key in props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = props[key]
          }
        }

        if (props.data) {
          newProps.data = props.data.refer(key)
        } else {
          newProps.data = getData().refer(key)
        }

        return <WrappedComponent {...newProps} />
      }
    }

    return WatchedComponent
  }
}
