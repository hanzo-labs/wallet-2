import React from 'react'
import ref from 'referential'

export var RefContext = React.createContext()

export class RefProvider extends React.Component {
  constructor(props) {
    super(props)

    this.data = props.data || ref({users:{hi:'HIII'}})
  }

  render() {
    let newProps = {}

    for (let key in this.props) {
      if (this.props.hasOwnProperty(key)) {
        newProps[key] = this.props[key]
      }
    }

    newProps.data = this.data
    // console.log('RefProvider', newProps.children)

    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ...newProps })
    );

    return <>{childrenWithProps}</>
  }
}
