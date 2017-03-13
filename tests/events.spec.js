/* global effroi describe before beforeEach it */

const { mouse } = effroi

import yi from '../'

const append = (type) => {
  const el = document.createElement(type)
  document.body.appendChild(el)
  return el
}

const remove = (index) => {
  const el = document.body.children[index]
  document.body.removeChild(el)
  return Promise.resolve()
}

describe('events', () => {
  before(() => {
    yi.init({
      events: {
        exitIntent: {
          threshold: 10
        },
        activity: {
          timeToIdle: 1000,
          autoInit: false
        }
      }
    })
  })

  beforeEach(() => {
    localStorage.clear()
  })

  it('should trigger exit intent', function (done) {
    yi.events.on('exitintent', () => remove(0).then(done))
    mouse.select(append('textarea')).should.equal(true)
  })

  it('should trigger idle', function (done) {
    yi.events.on('idle', done)
    yi.events.detectors.activity.init()
  })

  it('should trigger active', function (done) {
    yi.events.on('active', () => remove(0).then(done))
    mouse.select(append('textarea')).should.equal(true)
  })
})
