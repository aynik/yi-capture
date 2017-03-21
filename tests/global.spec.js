/* global describe before it after */

import Capture from '../'

describe('global', () => {
  let capture

  before(() => {
    capture = new Capture({
      detectors: { browser: {} }
    })
  })

  it('should have detected browser information', () => {
    capture.detectors.collection.browser.name.should.equal('PhantomJS')
    capture.detectors.collection.browser.version.should.equal('2.1')
  })

  after(() => {
    capture.destroy()
  })
})
