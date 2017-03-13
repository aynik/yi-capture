/* global effroi describe beforeEach it */

const { mouse } = effroi

import yi from '../'

const append = (type) => {
  const el = document.createElement(type)
  document.body.appendChild(el)
  return el
}

describe('intents', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should trigger exit intent', function (done) {
    yi.intents.on('exit', done)
    mouse.select(append('textarea')).should.equal(true)
  })
})
