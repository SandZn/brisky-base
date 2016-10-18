'use strict'
const test = require('tape')
const base = require('../../')
const isEmpty = require('brisky-is-empty')
test('keys', t => {
  const obj = base({
    a: true,
    b: true,
    val: 'something'
  })
  t.equal(obj.keys().length, 2, 'correct length')
  obj.removeProperty(obj.a, 'a')
  t.equal(obj.keys().length, 1, 'correct length after removal')
  obj.setKey('c', true)
  t.equal(obj.keys().length, 2, 'correct length after setKey')
  obj.reset()
  t.equal(isEmpty(obj), true, 'empty after reset')
  t.equal(obj.keys().length, 0, 'keys are false after reset')
  obj.set({ d: true })
  t.equal(obj.keys().length, 1, 'correct length after set')
  obj.set({ c: null })
  t.equal(obj.keys().length, 1, 'correct length after set with null')
  obj.set({ d: null })
  t.equal(obj.keys().length, 0, 'correct length after set with null of 1 key')
  t.end()
})
