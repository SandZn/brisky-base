'use strict'
const test = require('tape')
const Base = require('../')

test('constructor - custom', function (t) {
  function Special (val) {
    this.lullz = val
  }
  const a = new Base({
    Constructor: Special
  })
  const aInstance = new a.Constructor('hello')
  t.equal(aInstance instanceof Special, true, 'uses custom constructor')
  t.end()
})
