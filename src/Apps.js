import axios from 'axios'
import EventEmitter from 'events'
import Detectors from './Detectors'

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

  prefetch () {
    axios.get(this.url).then((res) => {
      this._url = this.url
      this.url = 'data:text/html;charset=UTF-8,' +
        encodeURIComponent(res.data.replace('<head>',
          '<head>\n<base href="' + this._url + '" />'))
    })
  }

  load () {
    const frame = document.createElement('iframe')
    frame.style.position = 'fixed'
    frame.style.width = '100vw'
    frame.style.height = '100vh'
    frame.style.zIndex = 999
    frame.style.top = 0
    frame.src = this.url
    document.body.appendChild(frame)
    frame.onload = () => this.emit('load')
    this.frame = frame
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
