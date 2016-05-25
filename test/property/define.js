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
      define: {
        x: { key: null }
      }
    }
  })
  t.same(base.x === 0 && base.z === null, true, 'moved property z → x')
  base.set({
    x: 'hello'
  })
  t.same(base.x, 'hello', 'redefined property x → x')
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
    },
    x: 'its z!'
  })
  t.same(base.z && base.z.val === 'its z!' && base.y === null, true, 'moved property y → z')
  t.same(base.properties.x.base.key, 'z', 'property got correct key')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')

  base.set({
    properties: {
      define: {
        x: {
          key: null,
          val: { field: 'hello' }
        }
      }
    }
  })
  t.same(base.x && base.x.isBase && base.z === null, true, 'moved property z → x')
  t.same(base.x && base.x.field.val, 'hello', 'set property x')
  t.same(base.properties.keyMap, null, 'remove property map')
  t.end()
})
