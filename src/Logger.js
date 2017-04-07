export default class Logger {
  constructor (config = { level: null }) {
    const labels = [
      'debug',
      'info',
      'warn',
      'error',
      'silent'
    ]
    this.levels = labels
      .reduce((levels, label, level) => {
        levels[label] = level
        return levels
      }, {})
    labels.map((label) => {
      this[label] = (...msgs) => {
        if (this.level <= this.levels[label]) {
          console.log(label + ':', ...msgs)
        }
      }
    })
    this.setLevel(config.level === null
      ? labels[labels.length - 1] : config.level)
  }

  setLevel (label) {
    const level = this.levels[label]
    if (isNaN(level)) {
      throw new Error('Logging level "' + label + '" not available')
    }
    this.level = level
  }
}
