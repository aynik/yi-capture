import Events from './Events'

class Capture {
  constructor (config = { events: {} }) {
    this.events = new Events(config.events)
  }
}

module.exports = Capture
