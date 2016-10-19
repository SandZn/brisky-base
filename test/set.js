'use strict'
const test = require('tape')
const base = require('../')

test('set - resolve context', t => {
  t.plan(2)
  const a = base({ b: { c: true } })
  const b = new a.Constructor({ key: 'b' })
  t.same(b.b.c.path(), [ 'b', 'b', 'c' ], 'correct resolved contextPath')
  b.b.set({ something: true })
  t.equal(b.hasOwnProperty('_b'), true, 'resolved b.b after set')
})

test('set - type', t => {
  const a = base({
    types: {
      x: 'lulllz'
    },
    x: 'something'
  })
  const x = a.x.uid()
  a.set({ x: { type: 'x' } })
  t.equal(a.x.val, 'lulllz', 'created new x type')
  t.equal(x !== a.x.uid(), true, 'overwritten old x property')
  const y = new a.x.Constructor()
  t.ok(y.uid() !== a.x.uid(), 'instance uid is not equal to original')
  t.end()
})

test('set - reserved key error', t => {
  t.plan(1)
  const a = base({
    define: {
      field: { val: 'haha reserved!' }
    }
  })
  try {
    a.set({
      field: 'haha'
    })
  } catch (e) {
    t.equal(e.message, 'cannot set property "field", on "base" ')
  }
  t.end()
})

test('set - param and isNew', t => {
  var results = []
  var newArray = []

  const obj = base({
    child: {
      define: {
        extend: {
          set (method, val, stamp, nocontext, params, isNew) {
            if (params === 'HELLO') {
              results.push(this.path())
            }
            if (isNew) {
              newArray.push(this.path())
            }
            return method.call(this, val, stamp, nocontext, params, isNew)
          }
        }
      },
      child: 'Constructor'
    }
  })

  obj.set({
    a: {
      b: true
    }
  }, false, false, 'HELLO')
  t.same(results, [ [ 'a' ], [ 'a', 'b' ] ], 'receives param for normal children')
  t.same(newArray, [ [ 'a' ], [ 'a', 'b' ] ], 'receives isNew for new children')

  results = []
  newArray = []
  obj.set({
    properties: {
      hello: { text: '100' }
    },
    hello: {
      text: 200
    }
  }, false, false, 'HELLO')
  t.same(results, [ [ 'hello' ], [ 'hello', 'text' ] ], 'receives param for properties')
  t.same(newArray, [ [ 'hello' ], [ 'hello', 'text' ], [ 'hello' ] ], 'receives isNew for new children')

  results = []
  newArray = []
  obj.set({
    types: {
      hello: { text: '100' }
    },
    a: {
      type: 'hello',
      text: 200
    }
  }, false, false, 'HELLO')
  t.same(results, [ [ 'a' ], [ 'a', 'text' ] ], 'receives param for types')
  t.same(newArray, [ [], [ 'text' ], [ 'a' ] ], 'receives isNew for new children')

  t.end()
})
