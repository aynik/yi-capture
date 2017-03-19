import Apps from './Apps'

class Capture {
  constructor (config = { apps: {} }) {
    this.apps = new Apps(config.apps)
  }

  destroy () {
    this.apps.destroy()
  }
}

module.exports = Capture
