'use strict'
var test = require('tape')
var isEmpty = require('vigour-util/is/empty')
var Base = require('../')

test('keys', function (t) {
  var base = new Base({
    a: true,
    b: true,
    val: 'something'
  })
  t.plan(6)
  t.equal(base.keys().length, 2, 'correct length')
  base.removeProperty(base.a, 'a')
  t.equal(base.keys().length, 1, 'correct length after removal')
  base.setKey('c', true)
  t.equal(base.keys().length, 2, 'correct length after setKey')
  base.clear()
  t.equal(isEmpty(base), true, 'isEmpty === true after clear')
  t.equal(base.keys(), false, 'keys are false after clear')
  base.set({ d: true })
  t.equal(base.keys().length, 1, 'correct length after set')
})
