import axios from 'axios'
import EventEmitter from 'events'
import Api from './Api'
import Detectors from './Detectors'
import { bindEvent, bindEvents } from './util'

const uuidv4 = () => '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

export class App extends EventEmitter {
  constructor (config = { api: {}, detectors: {}, events: {} }) {
    super()
    Object.assign(this, config)
    this.api = new Api(config.api)
    this.detectors = new Detectors(config.detectors)
    bindEvents(this, config.events)
  }

  bindEvent (...args) {
    return bindEvent(this, ...args)
  }

  sendEvent (type) {
    const { browser } = this.detectors.collection
    return this.api.createEvent({
      id: uuidv4(),
      appId: this.id,
      type,
      browser
    })
  }

  prefetch () {
    return new Promise((resolve, reject) => {
      axios.get(this.url).then((res) => {
        this._url = this.url
        this.url = 'data:text/html;charset=UTF-8,' +
          encodeURIComponent(res.data.replace('<head>',
            '<head>\n<base href="' + this._url + '" />'))
        resolve(this.url)
      }).catch(reject)
    })
  }

  load () {
    return new Promise((resolve, reject) => {
      const frame = document.createElement('iframe')
      frame.style.border = 0
      frame.style.position = 'fixed'
      frame.style.width = '100vw'
      frame.style.height = '100vh'
      frame.style.zIndex = 999
      frame.style.top = 0
      frame.src = this.url
      document.body.appendChild(frame)
      frame.onload = () => this.emit('load')
      this.frame = frame
      resolve(frame)
    })
  }

  unload () {
    return new Promise((resolve, reject) => {
      if (this.frame) {
        document.body.removeChild(this.frame)
        resolve(this.frame)
        delete this.frame
        this.emit('unload')
      }
    })
  }

  destroy () {
    return new Promise((resolve, reject) => {
      resolve(this)
      this.unload()
      this.detectors.destroy()
      this.emit('destroy')
    })
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
