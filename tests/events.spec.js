/* global effroi describe before beforeEach it */

const { mouse } = effroi

import yi from '../'

const append = (type) => {
  const el = document.createElement(type)
  document.body.appendChild(el)
  return el
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
    yi.events.on('exitintent', done)
    mouse.select(append('textarea')).should.equal(true)
  })

  it('should trigger idle', function (done) {
    yi.events.on('idle', done)
    yi.events.detectors.activity.init()
  })
})
