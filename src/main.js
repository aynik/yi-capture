import Apps from './Apps'
import Detectors from './Detectors'

class Capture {
  constructor (config = { apps: {}, detectors: {} }) {
    this.apps = new Apps(config.apps)
    this.detectors = new Detectors(config.detectors)
  }

  destroy () {
    this.apps.destroy()
    this.detectors.destroy()
  }
}

module.exports = Capture
