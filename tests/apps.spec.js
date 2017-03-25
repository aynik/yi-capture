/* global effroi describe before it after */

const { mouse } = effroi

import sinon from 'sinon'
import Capture from '../'
import Detectors from '../src/Detectors'

import { append, findAll, remove, listen, unlisten } from './util'

const uuidv4 = () => '110ec58a-a0f2-4ac4-8393-c866d813b8d1'

describe('apps', () => {
  let sandbox
  let capture
  let browser
  let events
  let onmessage

  before(() => {
    sandbox = sinon.sandbox.create()

    capture = new Capture({
      apps: {
        panel: {
          id: 1,
          url: '/base/tests/fixtures/panel.html',
          detectors: {
            browser: {},
            exitIntent: {
              threshold: 10,
              maxDisplays: 1
            },
            activity: {
              timeToIdle: 1000,
              autoInit: false
            }
          },
          events: {
            ready: {
              action: 'prefetch'
            },
            idle: {
              action: 'unload'
            }
          }
        }
      }
    })

    browser = capture.apps.collection.panel.detectors.collection.browser

    events = {
      exitIntent: {
        id: uuidv4(),
        appId: 1,
        type: 'exitintent',
        browser
      }
    }
  })

  it('should have loaded panel app', () => {
    capture.apps.collection.should.have.property('panel')
    capture.apps.collection.panel.should.have.property('url')
    capture.apps.collection.panel.should.have.property('events')
    capture.apps.collection.panel.should.have.property('detectors')
    capture.apps.collection.panel.detectors.should.be.instanceOf(Detectors)
    capture.apps.collection.panel.should.not.have.property('frame')
  })

  it('should trigger exit intent, load panel and send event', (done) => {
    capture.apps.collection.panel.once('load', () => {
      capture.apps.collection.panel.should.have.property('frame')
      findAll('iframe').length.should.equal(1)
      onmessage = listen(window, 'message', (event) => {
        event.data.should.equal('loaded')
        done()
      })
    })
    capture.apps.collection.panel.bindEvent('exitintent', ['load', 'sendEvent'])
      .then(([frame, eventData]) => {
        frame.should.equal(capture.apps.collection.panel.frame)
        eventData.should.deep.equal(events.exitIntent)
      })
    sandbox.stub(capture.apps.collection.panel.api.client, 'post')
      .callsFake((_, data) => (
        Promise.resolve({ data })
      ))
    mouse.select(append('textarea')).should.equal(true)
  })

  it('should trigger idle and unload panel', (done) => {
    capture.apps.collection.panel.once('unload', () => {
      capture.apps.collection.panel.should.not.have.property('frame')
      findAll('iframe').length.should.equal(0)
      done()
    })
    capture.apps.collection.panel.detectors.collection.activity.init()
  })

  it('should destroy panel', (done) => {
    capture.apps.collection.panel.on('destroy', () => {
      capture.apps.collection.should.not.have.property('panel')
      done()
    })
    capture.apps.collection.panel.destroy()
  })

  after(() => {
    unlisten(window, 'message', onmessage)
    findAll('textarea').forEach(remove)
    sandbox.restore()
    capture.destroy()
    localStorage.clear()
  })
})
