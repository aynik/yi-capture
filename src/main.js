import Events from './Events'

class Yi {
  init (config = { events: {} }) {
    this.events = new Events(config.events)
  }
}

const yi = global.yi = new Yi()
export default yi
