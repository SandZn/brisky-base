'use strict'
var test = require('tape')
var Base = require('../')

test('child', t => {
  const bchild = Base('bye')
  function Special (val) {
    this.internalStuff = val
  }

  const a = Base({
    child: { val: 'hello' },
    b: { child: bchild },
    c: { child: Special }
  })

  t.same(a.b.serialize(), 'hello', 'object notation')
  a.b.set({ c: {} })
  t.same(a.b.c.serialize(), 'bye', 'base notation')
  a.c.set({ special: 'hello' })
  t.same(a.c.special instanceof Special, true, 'custom constructor')
  a.set({ child: { field: true } })
  t.same(a.b.field.serialize(), true, 'b - use set when child is allready defined')
  t.same(a.c.field.serialize(), true, 'c - use set when child is allready defined')

  t.end()
})

test('child - merge', t => {
  const a = Base({
    child: { child: 'Constructor' },
    inject: [
      {
        child: {
          a: true
        }
      },
      {
        child: {
          b: true
        }
      }
    ]
  })
  a.set({ x: true })
  t.same(a.x.a.keys(), [ 'a', 'b' ], 'merged correctly')
  t.end()
})

test('child - recursive optmization', t => {
  const moduleA = {

  }

  const moduleB = {

  }

  const moduleC = {

  }


  const a = Base({
    child: { child: 'Constructor' }
  })
  t.end()
})
