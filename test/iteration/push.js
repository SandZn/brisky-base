'use strict'
const test = require('tape')
const base = require('../../')

test('push', t => {
  const a = base()
  const arr = []
  arr.push(a.push(1).key)
  arr.push(a.push(2).key)
  t.same(a.keys(), arr, 'correct return value and keys')
  t.end()
})
