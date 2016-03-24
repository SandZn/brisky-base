'use strict'
const test = require('tape')
const Base = require('../')

test('set property', function (t) {
  t.plan(2)
  var cnt = 0
  const base = new Base({ set () { cnt++ } })
  base.set(1)
  base.set(1)
  t.equal(base.val, 1, 'base.val equals 1')
  t.equal(cnt, 1, 'set hook fired once')
})

test('origin property', function (t) {
  t.plan(1)
  const a = new Base({})
  const b = new Base(a)
  b.set({ origin: 1 })
  t.equal(a.val, 1, 'a.val equals 1')
})
