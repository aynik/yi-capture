import EventEmitter from 'events'
import Exitent from 'Exitent'
import bowser from 'bowser'
import createActivityDetector from 'activity-detector'

export default class Detectors extends EventEmitter {
  constructor (config = {}) {
    super()
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
    this.collection.browser = bowser._detect(window.navigator.userAgent)
  }

  _initExitIntentDetector (config = {}) {
    this.collection.exitIntent = new Exitent({
      ...config,
      onExitent: () => (
        this.emit('exitintent')
      )
    })
  }

  _initActivityDetector (config = {}) {
    const activity = createActivityDetector(config)
    activity.on('idle', () => this.emit('idle'))
    activity.on('active', () => this.emit('active'))
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
    exitIntent.eventListeners.forEach((_, eventName) => {
      exitIntent.removeEvent(eventName)
    })
  }

  _destroyActivityDetector () {
    const { activity } = this.collection
    activity.stop()
  }
}
