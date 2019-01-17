import Emitter from 'es6-event-emitter'

export default class MyEmitter extends Emitter {
  trigger(event, ...args){
    if(typeof event === 'undefined'){
      throw new Error('You must provide an event to trigger.')
    }

    let listeners = this.events[event]
    let onceListeners = []
    let results = []

    if(typeof listeners !== 'undefined') {
      results = listeners.reduce((results, v, k) => {
        results.push(v.cb.apply(this, args))

        if(v.once) onceListeners.unshift(k)
      })

      onceListeners.forEach((v, k) => {
        listeners.splice(k, 1)
      })
    }

    return results
  }
}
