import Detectors from './Detectors'
import EventEmitter from 'events'

export class App extends EventEmitter {
  constructor (config = { detectors: {}, events: {} }) {
    super()
    Object.assign(this, config)

    this.detectors = new Detectors(config.detectors)

    for (let event in config.events) {
      this.detectors.once(event, () => (
        this[config.events[event].action](name)
      ))
    }
  }

  load () {
    return new Promise((resolve, reject) => {
      const frame = document.createElement('iframe')
      frame.src = this.url
      document.body.appendChild(frame)
      frame.onload = () => resolve(frame)
      this.frame = frame
      this.emit('load')
    })
  }

  unload () {
    if (this.frame) {
      document.body.removeChild(this.frame)
      delete this.frame
      this.emit('unload')
    }
  }

  destroy () {
    this.unload()
    this.detectors.destroy()
    this.emit('destroy')
  }
}

export default class Apps {
  constructor (config = {}) {
    this.collection = {}
    for (let name in config) {
      this.collection[name] = new App(config[name])
      this.collection[name].once('destroy', () => {
        delete this.collection[name]
      })
    }
  }

  destroy () {
    for (let app in this.collecton) {
      this.collection[app].destroy()
    }
  }
}
