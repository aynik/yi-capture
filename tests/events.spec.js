/* global effroi describe before beforeEach it */

const { mouse } = effroi

import Capture from '../'

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
  let capture

  before(() => {
    capture = new Capture({
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
    capture.events.on('exitintent', () => remove(0).then(done))
    mouse.select(append('textarea')).should.equal(true)
  })

  it('should trigger idle', function (done) {
    capture.events.on('idle', done)
    capture.events.detectors.activity.init()
  })

  it('should trigger active', function (done) {
    capture.events.on('active', () => remove(0).then(done))
    mouse.select(append('textarea')).should.equal(true)
  })
})
