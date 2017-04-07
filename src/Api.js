import axios from 'axios'

const { API_BASE_URL } = process.env

export default class Api {
  constructor (logger, config = { baseURL: API_BASE_URL }) {
    this.logger = logger
    this.client = axios.create(config)
  }

  createEvent (data) {
    const route = '/events'
    const event = new Event(data)
    this.logger.debug('http post request to ' + route, event)
    return this.client.post(route, event).then((response) => {
      this.logger.debug('received response', response.data)
      return response.data
    })
  }
}

class Event {
  constructor (data = { type: null }) {
    if (data.type === null) {
      throw new Error('Event must have a type')
    }
    Object.assign(this, data)
  }
}
