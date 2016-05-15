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
  t.same(b.b.c.path(), [ 'b', 'b', 'c'], 'correct resolved contextPath')
  b.b.set({ something: true })
  t.equal(b.hasOwnProperty('_b'), true, 'resolved b.b after set')
})

test('set - type', function (t) {
  var a = new Base({
    components: {
      x: 'lulllz'
    },
    x: 'something'
  })
  a.set({
    x: { type: 'x' }
  })
  t.end()
})
