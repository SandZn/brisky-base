'use strict'
const test = require('tape')
const Base = require('../../')

test('property - default', function (t) {
  const base = new Base({
    properties: { x: true },
    x: 100
  })
  t.equal(base.x, 100, 'x equals 100')
  t.end()
})

test('property - function', function (t) {
  const base = new Base({
    properties: {
      x (val, stamp) { this.y = val * 10 }
    },
    x: 100
  })
  t.equal(base.y, 1000, 'y equals 1000')
  t.end()
})

test('property - base', function (t) {
  const y = new Base('y')
  const base = new Base({
    types: { z: 'z' },
    properties: {
      x: 'x',
      y: y,
      z: { type: 'z' }
    },
    x: {},
    y: {},
    z: {}
  })
  t.same(
    base.y instanceof y.Constructor,
    true,
    'y is an instance o y.Constructor'
  )
  t.same(base.y.val, 'y', 'y has correct value')
  t.same(base.x.val, 'x', 'x has correct value')
  t.same(
    base.z instanceof base.types.z.Constructor,
    true,
    'z is an instance of base.types.z.Constructor'
  )
  t.same(base.z.val, 'z', 'z has correct value')
  t.end()
})

test('property - null', function (t) {
  t.end()
})
