'use strict'
const test = require('tape')
const Base = require('../')

test('each', function (t) {
  const a = new Base({
    a: 'a',
    b: 'b',
    c: 'c',
    d: {
      keyType: 'special'
    },
    e: 'e'
  })
  var results = {}
  a.each((p, key) => {
    results[key] = results[key] ? results[key]++ : 1
  })
  t.same(
    results,
    { a: 1, b: 1, c: 1, e: 1 },
    'each loops trough all normal keys, excludes d'
  )

  results = {}
  var val = a.each((p, key) => {
    results[key] = results[key] ? results[key] + 1 : 1
    if (key === 'd') {
      return true
    }
  }, (p, key) => p && p._base_version)
  t.same(
    results,
    { a: 1, b: 1, c: 1, d: 1 },
    'filtered each loops trough all keys, return breaks loop'
  )
  t.equal(val, true, 'returns value from iterator')

  results = {}
  val = a.each((p, key) => {
    results[key] = results[key] ? results[key]++ : 1
    if (key === 'b') {
      // this breaks the loop
      return key
    }
  })
  t.same(
    results,
    { a: 1, b: 1 },
    'each loops trough all normal keys, return breaks loop'
  )
  t.equal(val, 'b', 'returns value from iterator')

  t.end()
})
