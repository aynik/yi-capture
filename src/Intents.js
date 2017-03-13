import EventEmitter from 'events'
import Exitent from 'Exitent'

export default class Intents extends EventEmitter {
  constructor () {
    super()
    this._handlers = {
      exit: new Exitent({
        threshold: 10,
        storageLife: 1,
        onExitent: () => (
          this.emit('exit')
        )
      })
    }
  }
}


