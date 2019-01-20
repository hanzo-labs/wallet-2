import React from 'react'
import { RefContext } from './provider'

export let watch = (key) => {
  return (WrappedComponent) => {
    return class WatchedComponent extends React.Component {
      constructor(props) {
        super(props)
      }

      componentWillUnmount() {
        if (this.data) {
          this.data.destroy()
        }
      }

      render() {
        let props = this.props
        let newProps = Object.assign({}, props)

        return <RefContext.Consumer>
            { ({ data }) => {
              // prioritize props.data over context data field
              let contextData = data
              if (props.data) {
                contextData = props.data
              }

              // avoid duplication
              if (!this.data) {
                // key essentially namespaces the data, either namespace the
                // context free one from the Ref context or a contexualized one
                // from props
                if (key) {
                  if (props.data) {
                    contextData = this.data = props.data.ref(key)
                  } else {
                    contextData = this.data = data.ref(key)
                  }
                }
              }

              return <WrappedComponent {...newProps} rootData={ data } data={ contextData } />
            }}
          </RefContext.Consumer>
      }
    }
  }
}
