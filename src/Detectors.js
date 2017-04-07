import EventEmitter from 'events'
import Exitent from 'Exitent'
import bowser from 'bowser'
import createActivityDetector from 'activity-detector'

export default class Detectors extends EventEmitter {
  constructor (logger, config = {}) {
    super()
    this.logger = logger
    this.collection = {}
    if (config.browser) {
      this._initBrowserDetector()
    }
    if (config.exitIntent) {
      this._initExitIntentDetector(config.exitIntent)
    }
    if (config.activity) {
      this._initActivityDetector(config.activity)
    }
    setImmediate(() => this.emit('ready'))
  }

  _initBrowserDetector () {
    const detected = bowser._detect(window.navigator.userAgent)
    const browser = {
      name: detected.name,
      version: detected.version,
      device: detected.tablet
        ? 'tablet' : detected.mobile
        ? 'mobile' : 'desktop'
    }
    this.logger.debug('detectors', 'detected browser', browser)
    this.collection.browser = browser
  }

  _initExitIntentDetector (config = {}) {
    this.collection.exitIntent = new Exitent({
      ...config,
      onExitent: () => {
        this.logger.debug('detectors', 'detected exit intent')
        this.emit('exitintent')
      }
    })
  }

  _initActivityDetector (config = {}) {
    const activity = createActivityDetector(config)
    activity.on('idle', () => {
      this.logger.debug('detectors', 'detected idle')
      this.emit('idle')
    })
    activity.on('active', () => {
      this.logger.debug('detectors', 'detected active')
      this.emit('active')
    })
    this.collection.activity = activity
  }

  destroy () {
    if (this.collection.exitIntent) {
      this._destroyExitIntentDetector()
    }
    if (this.collection.activity) {
      this._destroyActivityDetector()
    }
  }

  _destroyExitIntentDetector () {
    const { exitIntent } = this.collection
    this.logger.debug('detectors', 'destroying exit intent detector')
    exitIntent.eventListeners.forEach((_, eventName) => {
      exitIntent.removeEvent(eventName)
    })
  }

  _destroyActivityDetector () {
    const { activity } = this.collection
    this.logger.debug('detectors', 'destroying activity detector')
    activity.stop()
  }
}
