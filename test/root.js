'use strict'
const test = require('tape')
const Base = require('../')

test('root', t => {
  const base = Base({ a: { b: { c: true } } })
  t.equal(base.a.b.c.getRoot(), base, 'works with a method')
  t.equal(base.a.b.c.root, base, 'works with getter')
  t.end()
})
