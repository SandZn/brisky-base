'use strict'
const test = require('tape')
const isEmpty = require('vigour-util/is/empty')
const Base = require('../')

test('keys', function (t) {
  const base = new Base({
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

test('ordered keys', function (t) {
  t.plan(2)
  const base = new Base({
    a: { val: true, order: 1 },
    b: true,
    c: { val: true, order: -1 }
  })
  t.deepEqual(base.keys(), [ 'c', 'b', 'a' ], 'correct order')
  base.a.set({ order: -2 })
  t.deepEqual(base.keys(), [ 'a', 'c', 'b' ], 're-order a')
})
