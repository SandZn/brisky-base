'use strict'
const test = require('tape')
const Base = require('../')

test('set - resolve context', function (t) {
  t.plan(2)
  var a = new Base({
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
  var a = new Base({
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
  var a = new Base({
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

test('set - param', function (t) {
  const base = new Base({
    child: {
      define: {
        extend: {
          set (method, val, stamp, nocontext, params, isNew) {
            console.log(params, isNew)
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

  t.end()
})
