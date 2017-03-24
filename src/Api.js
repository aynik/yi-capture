import axios from 'axios'

const { API_BASE_URL } = process.env

export default class Api {
  constructor (config = { baseURL: API_BASE_URL }) {
    this.client = axios.create(config)
  }

  createEvent (data) {
    return this.client.post('/events', new Event(data))
    .then((response) => response.data)
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
