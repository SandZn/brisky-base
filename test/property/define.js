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
  t.same(base.z, 0, 'moved property y → z')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  t.end()
})
