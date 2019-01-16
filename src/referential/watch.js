import React from 'react'
// import akasha from 'akasha'

export var watch = (key) => {
  return (WrappedComponent) => {
    class WatchedComponent extends React.Component {
      constructor(props) {
        super(props)

        console.log('Watch', props.data)

        let newRef = props.data.refer(key)
        let akashaKey = '_' + key

        newRef.on('set', () => {
          if (window) {
            akasha.set(akashaKey, newRef.get())
          }
          this.forceUpdate()
        })

        let data = newRef.get()

        if (!data || JSON.stringify(data) == '{}') {
          if (window) {
            newRef.set(akasha.get(akashaKey) || {})
          }
        }
      }

      render() {
        let props = this.props
        let newProps = {}

        for (let key in props) {
          if (this.props.hasOwnProperty(key)) {
            newProps[key] = props[key]
          }
        }

        newProps.data = props.data.refer(key)
        console.log('data1', newProps.data)

        return <WrappedComponent {...newProps} />
      }
    }

    return WatchedComponent
  }
}
