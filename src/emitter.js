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
      results = listeners.map((v, k) => {
        if(v.once) onceListeners.unshift(k)

        return v.cb.apply(this, args)
      })

      onceListeners.forEach((v, k) => {
        listeners.splice(k, 1)
      })
    }

    return results
  }

  off(event, cb){
    if(typeof this.events[event] === 'undefined'){
      throw new Error(`Event not found - the event you provided is: ${event}`)
    }

    const listeners = this.events[event]

    if (!cb) {
      delete this.events[event]
      this.eventLength--
      return this
    }

    listeners.forEach((v, i) => {
      if(v.cb === cb) {
        listeners.splice(i, 1)
      }
    })

    if(listeners.length === 0){
      delete this.events[event]

      this.eventLength--
    }

    return this
  }
}
