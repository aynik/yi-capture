/* global effroi describe before beforeEach it after */

const { mouse } = effroi

import Capture from '../'
import Detectors from '../src/Detectors'

import { append, findAll, remove, listen, unlisten } from './util'

describe('apps', () => {
  let capture
  let onmessage

  before(() => {
    capture = new Capture({
      apps: {
        panel: {
          url: '/base/tests/fixtures/panel.html',
          detectors: {
            exitIntent: {
              threshold: 10
            },
            activity: {
              timeToIdle: 1000,
              autoInit: false
            }
          },
          events: {
            exitintent: {
              action: 'load'
            },
            idle: {
              action: 'unload'
            }
          }
        }
      }
    })
  })

  beforeEach(() => {
    localStorage.clear()
  })

  it('should have loaded panel app', () => {
    capture.apps.collection.should.have.property('panel')
    capture.apps.collection.panel.should.have.property('url')
    capture.apps.collection.panel.should.have.property('events')
    capture.apps.collection.panel.should.have.property('detectors')
    capture.apps.collection.panel.detectors.should.be.instanceOf(Detectors)
    capture.apps.collection.panel.should.not.have.property('frame')
  })

  it('should trigger exit intent and load panel', (done) => {
    capture.apps.collection.panel.once('load', () => {
      capture.apps.collection.panel.should.have.property('frame')
      findAll('iframe').length.should.equal(1)
      onmessage = listen(window, 'message', (event) => {
        event.data.should.equal('loaded')
        done()
      })
    })
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
    capture.destroy()
  })
})
