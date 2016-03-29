'use strict'
const test = require('tape')
const Base = require('../')

test('serialize', function (t) {
  const cases = [
    { a: true, b: { c: 'yo' } },
    [
      { a: true, b: { val: ['$', 'a'] } },
      { a: true, b: ['$', 'a'] }
    ]
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item[0] || item)
    t.deepEquals(base.serialize(), item[1] || item, base)
  })
})

test('serialize-computed', function (t) {
  const cases = [
    { a: true, b: { c: 'yo' } },
    [
      { a: 'a', b: { val: [ '$', 'a' ] } },
      { a: 'a', b: 'a' }
    ]
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item[0] || item)
    t.deepEquals(base.serialize(true), item[1] || item, base)
  })
})
