import EventEmitter from 'events'
import Exitent from 'Exitent'
import createActivityDetector from 'activity-detector'

export default class Events extends EventEmitter {
  constructor (config = { exitIntent: {}, activity: {} }) {
    super()
    this.detectors = {}
    this._initExitIntentDetector(config.exitIntent)
    this._initActivityDetector(config.activity)
  }

  _initExitIntentDetector (config = {}) {
    this.detectors.exitIntent = new Exitent({
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
    this.detectors.activity = activity
  }
}
