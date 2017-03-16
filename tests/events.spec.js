/* global effroi describe before beforeEach it after */

const { mouse } = effroi

import Capture from '../'
import { append, remove, findAll } from './util'

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

  it('should trigger exit intent', (done) => {
    capture.events.on('exitintent', done)
    mouse.select(append('textarea')).should.equal(true)
  })

  it('should trigger idle', (done) => {
    capture.events.on('idle', done)
    capture.events.detectors.activity.init()
  })

  it('should trigger active', (done) => {
    capture.events.on('active', done)
    mouse.select(append('textarea')).should.equal(true)
  })

  after(() => {
    findAll('textarea').forEach(remove)
    capture.destroy()
  })
})
