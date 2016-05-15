'use strict'
const test = require('tape')
const Base = require('../../')

test('property - basic - set', function (t) {
  t.plan(2)
  var cnt = 0
  const base = new Base({ set () { cnt++ } })
  base.set(1)
  base.set(1)
  t.equal(base.val, 1, 'base.val equals 1')
  t.equal(cnt, 1, 'set hook fired once')
})

test('property - basic - origin', function (t) {
  t.plan(1)
  const a = new Base({})
  const b = new Base(a)
  b.set({ origin: 1 })
  t.equal(a.val, 1, 'a.val equals 1')
})

test('property - basic - set val definition to null', function (t) {
  t.plan(2)
  const a = new Base({
    properties: { val: null },
    Child: 'Constructor'
  })
  const b = new a.Constructor(a)
  b.set({ c: void 0, val: 1 })
  t.equal(b.val instanceof Base, true, 'val is a normal base')
  t.equal(b.c instanceof Base, true, 'field c gets created')
})

test('property - basic - wrong property type error', function (t) {
  t.plan(1)
  try {
    const a = new Base({
      properties: { val: void 0 },
      Child: 'Constructor'
    })
  } catch (e) {
    t.equal(
      e.message,
      'base.properties - uncaught property type val: "undefined"'
    )
  }
})
