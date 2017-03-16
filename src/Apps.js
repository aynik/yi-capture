export default class Apps {
  constructor (config = {}) {
    this.config = config
    this.frames = {}
  }

  load (name) {
    if (name in this.config) {
      return new Promise((resolve, reject) => {
        const frame = document.createElement('iframe')
        frame.src = this.config[name].url
        document.body.appendChild(frame)
        frame.onload = () => resolve(frame)
        this.frames[name] = frame
      })
    }
    return Promise.resolve(null)
  }

  destroy () {
    for (let name in this.frames) {
      document.body.removeChild(this.frames[name])
    }
  }
}
