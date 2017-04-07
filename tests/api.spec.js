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
  let events

  before(() => {
    localStorage.clear()
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

    browser = capture.detectors.collection.browser

    events = {
      exitIntent: {
        id: uuidv4(),
        appId: 0,
        type: 'exitintent',
        browser
      }
    }
  })

  it('should send an exitintent event', (done) => {
    capture.bindEvent('exitintent', 'sendEvent').then((data) => {
      data.should.deep.equal(events.exitIntent)
      done()
    })
    sandbox.stub(capture.api.client, 'post').callsFake((_, data) => (
      Promise.resolve({ data })
    ))
    mouse.select(append('textarea')).should.equal(true)
  })

  after(() => {
    findAll('textarea').forEach(remove)
    sandbox.restore()
    capture.destroy()
    localStorage.clear()
  })
})
