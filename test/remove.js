'use strict'
const test = require('tape')
const base = require('../')
const isRemoved = require('brisky-is-removed')

test('remove', t => {
  const obj = base({
    a: { b: { c: true } }
  })
  const c = obj.a.b.c
  obj.a.b.c.remove()
  t.equal(isRemoved(c), true, 'c is removed')
  obj.a.b.set({ c: true })
  t.equal(isRemoved(obj.a.b.c), false, 'c exists')
  obj.set({ a: null })
  t.equal(isRemoved(obj.a), true, 'obj a is removed using set notation')
  t.end()
})

test('remove - context', t => {
  const results = []
  const obj = base({
    child: {
      define: {
        extend: {
          contextRemove (method, key) {
            results.push(key)
            return method.call(this, key)
          }
        }
      },
      child: 'Constructor'
    },
    a: { b: { c: true } }
  })
  const instance = new obj.Constructor()
  instance.a.b.remove()
  t.same(results, [ 'b' ], 'fires contextRemove for b but nothing else')
  t.end()
})
