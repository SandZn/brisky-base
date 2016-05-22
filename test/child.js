'use strict'
var test = require('tape')
var Base = require('../')

test('child', function (t) {
  const bChild = new Base('bye')
  function Special (val) {
    this.internalStuff = val
  }

  const a = new Base({
    Child: { val: 'hello' },
    b: { Child: bChild },
    c: { Child: Special }
  })

  t.same(a.b.serialize(), 'hello', 'object notation')
  a.b.set({ c: {} })
  t.same(a.b.c.serialize(), 'bye', 'base notation')
  a.c.set({ special: 'hello' })
  t.same(a.c.special instanceof Special, true, 'custom constructor')
  a.set({ Child: { field: true } })
  t.same(a.b.field.serialize(), true, 'b - use set when child is allready defined')
  t.same(a.c.field.serialize(), true, 'c - use set when child is allready defined')
  t.end()
})
