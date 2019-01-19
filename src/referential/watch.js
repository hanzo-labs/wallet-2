import React from 'react'
import { getData } from './provider'

export let watch = (key) => {
  return (WrappedComponent) => {
    class WatchedComponent extends React.Component {
      constructor(props) {
        super(props)

        if (props.data) {
          this.data = props.data.refer(key)
        } else {
          this.data = getData().refer(key)
        }
      }

      componentWillUnmount() {
        this.data.destroy()
      }

      render() {
        let props = this.props
        let newProps = {}

        for (let key in props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = props[key]
          }
        }

        newProps.rootData = props.data
        newProps.data = this.data

        return <WrappedComponent {...newProps} />
      }
    }

    return WatchedComponent
  }
}
