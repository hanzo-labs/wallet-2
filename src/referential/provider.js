import React from 'react'
import ref from 'referential'
import akasha from '../mjs-fix/akasha'

export let RefContext = React.createContext(ref({}))

let lock = false

export default class RefProvider extends React.Component {
  constructor(props) {
    super(props)

    let data = props.data
    if (!data && typeof window != 'undefined') {
      data = akasha.get('data')
    }

    this.state = {
      value: {
        data: ref(data)
      },
      appIsMounted: false
    };

    this.state.value.data.on('set', () => {
      if (typeof window != undefined) {
        akasha.set('data', this.state.value.data.get())
      }

      if (lock) {
        return
      }

      lock = true

      requestAnimationFrame(() => {
        lock = false
        this.setState({
          value: {
            data: this.state.value.data
          }
        })
      })
    })
  }

  componentDidMount() {
    console.log('Ref Provider Mounted')
    this.setState({ appIsMounted: true });
  }

  render() {
    let newProps = Object.assign({}, this.props)

    return <RefContext.Provider value={ this.state.value }>
        { this.state.appIsMounted ? (
            this.props.children
          ) : (
            <div />
          )
        }
      </RefContext.Provider>
  }
}

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
              if (this.data) {
                contextData = this.data
              } else if (props.data) {
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
