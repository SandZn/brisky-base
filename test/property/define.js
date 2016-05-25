'use strict'
const test = require('tape')
const Base = require('../../')

test('property - define - default - key', function (t) {
  const base = new Base({
    properties: {
      define: {
        x: { key: 'y', val: true }
      }
    }
  })
  base.set({ x: 0 })
  t.same(base.y, 0, 'default type')
  t.same(base.properties.keyMap, { x: 'y' }, 'has correct key map')
  base.set({
    properties: {
      define: {
        x: { key: 'z' }
      }
    }
  })
  t.same(base.z === 0 && base.y === null, true, 'moved property y → z')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  base.set({
    properties: {
      define: { x: { key: null } }
    }
  })
  t.same(base.x === 0 && base.z === null, true, 'moved property z → x')
  t.end()
})

test('property - define - base - key', function (t) {
  const base = new Base({
    properties: {
      define: {
        x: { key: 'y', val: 0 }
      }
    }
  })
  base.set({ x: 0 })
  t.same(base.y && base.y.val, 0, 'base type')
  t.same(base.properties.keyMap, { x: 'y' }, 'has correct key map')
  base.getConstructor()
  base.set({
    properties: {
      define: {
        x: { key: 'z' }
      }
    }
  })
  t.same(base.z && base.z.val === 0 && base.y === null, true, 'moved property y → z')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  t.end()
})
