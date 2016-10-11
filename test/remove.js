'use strict'
const test = require('tape')
const Base = require('../base')
const isRemoved = require('brisky-is-removed')

test('remove', t => {
  t.plan(3)
  var base = Base({
    a: { b: { c: true } }
  })
  var c = base.a.b.c
  base.a.b.c.remove()
  t.equal(isRemoved(c), true, 'c is removed')
  base.a.b.set({ c: true })
  t.equal(isRemoved(base.a.b.c), false, 'c exists')
  base.set({ a: null })
  t.equal(isRemoved(base.a), true, 'base a is removed using set notation')
})
