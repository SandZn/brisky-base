'use strict'
const test = require('tape')
const Base = require('../../')

test('property - default - origin', function (t) {
  t.plan(1)
  const a = new Base({})
  const b = new Base(a)
  b.set({ origin: 1 })
  t.equal(a.val, 1, 'a.val equals 1')
})
