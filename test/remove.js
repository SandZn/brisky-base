'use strict'
const test = require('tape')
const base = require('../')
const isRemoved = require('brisky-is-removed')

test('remove', t => {
  t.plan(3)
  var obj = base({
    a: { b: { c: true } }
  })
  var c = obj.a.b.c
  obj.a.b.c.remove()
  t.equal(isRemoved(c), true, 'c is removed')
  obj.a.b.set({ c: true })
  t.equal(isRemoved(obj.a.b.c), false, 'c exists')
  obj.set({ a: null })
  t.equal(isRemoved(obj.a), true, 'obj a is removed using set notation')
})
