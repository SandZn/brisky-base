'use strict'
const test = require('tape')
const Base = require('../../')

test('property - define - key', function (t) {
  const base = new Base({
    properties: {
      define: {
        x: {
          key: 'y',
          val: true
        }
      }
    }
  })
  base.set({
    x: 'hello'
  })
  console.log('result', base.x, base.y)
  t.same(base.y, 'hello', 'default type')
  t.end()
})
