/* global describe before it after */

import Capture from '../'
import { findAll, listen, unlisten } from './util'

describe('apps', () => {
  let capture
  let onmessage

  before(() => {
    capture = new Capture({
      apps: {
        panel: {
          url: '/base/tests/fixtures/panel.html'
        }
      }
    })
  })

  it('should load panel app', (done) => {
    capture.apps.load('panel').then((frame) => {
      capture.apps.frames.should.have.property('panel')
      findAll('iframe').length.should.equal(1)
      onmessage = listen(window, 'message', (event) => {
        event.data.should.equal('loaded')
        done()
      })
    }).catch((err) => console.log(err))
  })

  after(() => {
    unlisten(window, 'message', onmessage)
    capture.destroy()
  })
})
