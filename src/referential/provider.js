import React from 'react'
import ref from 'referential'
import akasha from '../mjs-fix/akasha'

export let RefContext = React.createContext(ref({}))

let lock = false

export default class RefProvider extends React.Component {
  constructor(props) {
    super(props)

    let data = props.data
    if (!data && typeof window != undefined) {
      data = akasha.get('_data')
    }

    this.state = {
      value: {
        data: ref(data)
      },
      appIsMounted: false
    };

    this.state.value.data.on('set', () => {
      if (typeof window != undefined) {
        akasha.set('_data', this.state.value.data.get())
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
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true });
    });
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
