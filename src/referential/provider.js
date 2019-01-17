import React from 'react'
import ref from 'referential'
import akasha from './akasha'

export let RefContext = React.createContext()
export let data = null
export let getData = () => {
  return data
}

export class RefProvider extends React.Component {
  constructor(props) {
    super(props)

    data = props.data
    if (!data && typeof window != undefined) {
      data = ref(akasha.get('_data'))
    }

    this.state = {appIsMounted: false};

    data.on('set', () => {
      if (window) {
        akasha.set('_data', data.get())
      }
      this.forceUpdate()
    })
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      this.setState({ appIsMounted: true });
    });
  }

  render() {
    let newProps = {}

    for (let key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        newProps[key] = this.props[key]
      }
    }

    newProps.data = data
    // console.log('RefProvider', newProps.children)

    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ...newProps })
    );

    return <>{this.state.appIsMounted && childrenWithProps}</>
  }
}
