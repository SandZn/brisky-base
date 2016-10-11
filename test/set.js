'use strict'
const test = require('tape')
const Base = require('../')

test('set - resolve context', function (t) {
  t.plan(2)
  var a = Base({
    b: {
      c: true
    }
  })
  var b = new a.Constructor({ key: 'b' })
  t.same(b.b.c.path(), [ 'b', 'b', 'c' ], 'correct resolved contextPath')
  b.b.set({ something: true })
  t.equal(b.hasOwnProperty('_b'), true, 'resolved b.b after set')
})

test('set - type', function (t) {
  t.plan(2)
  var a = Base({
    types: {
      x: 'lulllz'
    },
    x: 'something'
  })
  var x = a.x.uid()
  a.set({ x: { type: 'x' } })
  t.equal(a.x.val, 'lulllz', 'created new x type')
  t.equal(x !== a.x.uid(), true, 'overwritten old x property')
  t.end()
})

test('set - reserved key error', function (t) {
  t.plan(1)
  var a = Base({
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

test('set - param and isNew', function (t) {
  var results = []
  var newArray = []

  const base = Base({
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

  base.set({
    a: {
      b: true
    }
  }, false, false, 'HELLO')
  t.same(results, [ [ 'a' ], [ 'a', 'b' ] ], 'receives param for normal children')
  t.same(newArray, [ [ 'a' ], [ 'a', 'b' ] ], 'receives isNew for new children')

  results = []
  newArray = []
  base.set({
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
  base.set({
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
