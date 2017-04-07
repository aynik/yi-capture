import Logger from './Logger'
import Apps from './Apps'
import Api from './Api'
import Detectors from './Detectors'
import { bindEvent, bindEvents } from './util'

const uuidv4 = () => '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

class Capture {
  constructor (config = { logger: {}, api: {}, apps: {}, detectors: {}, events: {} }) {
    this.logger = new Logger(config.logger)
    this.api = new Api(this.logger, config.api)
    this.apps = new Apps(this.logger, config.apps)
    this.detectors = new Detectors(this.logger, config.detectors)
    bindEvents(this, config.events)
    this.logger.debug('capture', 'instantiated')
  }

  bindEvent (...args) {
    return bindEvent(this, ...args)
  }

  sendEvent (type) {
    const { browser } = this.detectors.collection
    const event = {
      id: uuidv4(),
      appId: 0,
      type,
      browser
    }
    this.logger.debug('capture', 'sending event', event)
    return this.api.createEvent(event)
  }

  destroy () {
    this.logger.debug('capture', 'destroying apps')
    this.apps.destroy()
    this.logger.debug('capture', 'destroying detectors')
    this.detectors.destroy()
  }
}

module.exports = Capture
