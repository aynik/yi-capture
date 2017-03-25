import Apps from './Apps'
import Api from './Api'
import Detectors from './Detectors'
import { bindEvent, bindEvents } from './util'

const uuidv4 = () => '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

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

  sendEvent (type) {
    const { browser } = this.detectors.collection
    return this.api.createEvent({
      id: uuidv4(),
      appId: 0,
      type,
      browser
    })
  }

  destroy () {
    this.apps.destroy()
    this.detectors.destroy()
  }
}

module.exports = Capture
