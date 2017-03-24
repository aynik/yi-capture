/* global effroi describe before it after */

import sinon from 'sinon'
import Capture from '../'
import { append, findAll, remove } from './util'

const { mouse } = effroi

const uuidv4 = () => '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

describe('api', () => {
  let sandbox
  let capture
  let browser
  let device
  let events

  before(() => {
    sandbox = sinon.sandbox.create()

    capture = new Capture({
      detectors: {
        browser: {},
        exitIntent: {
          threshold: 10,
          maxDisplays: 1
        }
      }
    })

    browser = {
      name: capture.detectors.collection.browser.name,
      version: capture.detectors.collection.browser.version
    }

    device = {
      type: capture.detectors.collection.browser.tablet
        ? 'tablet' : capture.detectors.collection.browser.mobile
        ? 'mobile' : 'desktop'
    }

    events = {
      exitIntent: {
        id: uuidv4(),
        appId: uuidv4(),
        type: 'exitintent',
        browser,
        device
      }
    }
  })

  it('should send an exitintent event', (done) => {
    capture.bindEvent('exitintent', () => {
      return capture.api.createEvent(events.exitIntent)
    }).then((data) => {
      data.should.deep.equal(events.exitIntent)
      done()
    })
    const resolved = new Promise((resolve, reject) => (
      resolve({ data: events.exitIntent })
    ))
    sandbox.stub(capture.api.client, 'post').returns(resolved)
    mouse.select(append('textarea')).should.equal(true)
  })

  after(() => {
    findAll('textarea').forEach(remove)
    sandbox.restore()
    capture.destroy()
    localStorage.clear()
  })
})
