'use strict'
const test = require('tape')
const Base = require('../')

test('serialize', function (t) {
  const cases = [
    { a: true, b: { c: 'yo' } },
    [
      { a: true, b: { val: '$root.a' } },
      { a: true, b: '$root.a' }
    ],
    [ { a: { val: null } }, { a: null } ]
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
      { a: 'a', b: { val: '$root.a' } },
      { a: 'a', b: 'a' }
    ]
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item[0] || item)
    t.deepEquals(base.serialize(true), item[1] || item, base)
  })
})
