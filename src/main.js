import Events from './Events'
import Apps from './Apps'

class Capture {
  constructor (config = { events: {}, apps: {} }) {
    this.events = new Events(config.events)
    this.apps = new Apps(config.apps)
  }

  destroy () {
    this.events.destroy()
    this.apps.destroy()
  }
}

module.exports = Capture
