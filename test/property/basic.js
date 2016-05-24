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
      z: { type: 'z' },
      base: Base
    },
    x: {},
    y: {},
    z: { field: 'z' }
  })
  t.equal(
    base.properties.base.base !== Base.prototype,
    true,
    'created instance of Base'
  )
  t.equal(
    base.y instanceof y.Constructor,
    true,
    '.y is instanceof y'
  )
  t.equal(base.y.val, 'y', 'y has correct value')
  t.equal(base.x.val, 'x', 'x has correct value')
  t.equal(
    base.z instanceof base.types.z.Constructor,
    true,
    '.z is instanceof base.types.z'
  )
  t.equal(base.z.val, 'z', 'z has correct value')
  base.set({
    properties: {
      x: { type: 'x' },
      y: true,
      z: 'Z'
    }
  })
  t.equal(base.x, null, '.x is removed by different type')
  t.equal(base.y, null, '.y is removed by type change')
  t.equal(base.z.val, 'Z', '.z is set to Z')
  const instance = new base.Constructor({
    properties: {
      z: {
        val: 'Z-2',
        field: 'yuz'
      }
    }
  })
  t.equal(base.z.val, 'Z', '.z is not influenced by instance')
  t.equal(instance.z.val, 'Z-2', 'instance.z has correct value')
  t.equal(
    instance.properties.z.base instanceof base.properties.z.base.Constructor,
    true,
    'instance.properties.z is instanceof .properties.z'
  )
  t.equal(
    instance.z instanceof instance.properties.z.base.Constructor,
    true,
    'instance.z is instanceof instance.properties.z'
  )
  t.equal(
    instance.z.field.val,
    'z',
    'merged field from .z, exclude set on property (field)'
  )
  t.end()
})

test('property - null', function (t) {
  const base = new Base({
    properties: {
      x: true,
      y: {}
    },
    y: {}
  })
  // may need to check if property key is the same..
  base.set({ properties: { y: null } })

  t.end()
})
