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
    [ { a: null }, {} ],
    [ { a: { val: null } }, {} ]
  ]
  t.plan(cases.length)
  cases.forEach(function (item) {
    const base = new Base(item[0] || item)
    t.same(base.serialize(), item[1] || item, 'outputs ' + base)
  })
})

test('serialize - computed', function (t) {
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
    t.same(base.serialize(true), item[1] || item, 'outputs ' + base)
  })
})

test('serialize - filter', function (t) {
  const base = new Base({
    yuzi: {
      james: {
        marcus: true,
        secret: true
      }
    }
  })
  t.same(
    base.serialize(false, (prop) => prop.key !== 'secret'),
    { yuzi: { james: { marcus: true } } },
    'filters results'
  )
  t.end()
})
