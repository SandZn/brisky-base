'use strict'
const test = require('tape')
const Base = require('../')

test('serialize', function (t) {
  const cases = [
    { a: true, b: { c: 'yo' } },
    { a: true, b: { val: [ '$', 'a' ] } }
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item) // this is pretty bad get rid of the reuse
    t.deepEquals(base.serialize(), item, base)
  })
})

test('serialize-computed', function (t) {
  const cases = [
    { a: true, b: { c: 'yo' } },
    { a: true, b: { val: [ '$', 'a' ] } }
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item) // this is pretty bad get rid of the reuse
    t.deepEquals(base.serialize(), item, base)
  })
})
