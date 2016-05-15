'use strict'
const test = require('tape')
const Base = require('../')

test('lookup', function (t) {
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
