import Apps from './Apps'
import Detectors from './Detectors'
import Api from './Api'
import { bindEvent, bindEvents } from './util'

class Capture {
  constructor (config = { api: {}, apps: {}, detectors: {}, events: {} }) {
    this.api = new Api(config.api)
    this.apps = new Apps(config.apps)
    this.detectors = new Detectors(config.detectors)
    bindEvents(this, config.events)
  }

  bindEvent (...args) {
    return bindEvent(this, ...args)
  }

  destroy () {
    this.apps.destroy()
    this.detectors.destroy()
  }
}

module.exports = Capture
