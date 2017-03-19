import EventEmitter from 'events'
import Exitent from 'Exitent'
import createActivityDetector from 'activity-detector'

export default class Detectors extends EventEmitter {
  constructor (config = { exitIntent: {}, activity: {} }) {
    super()
    this.collection = {}
    this._initExitIntentDetector(config.exitIntent)
    this._initActivityDetector(config.activity)
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
    this._destroyExitIntentDetector()
    this._destroyActivityDetector()
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
