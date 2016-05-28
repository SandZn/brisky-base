'use strict'
const test = require('tape')
const Base = require('../')

test('move', function (t) {
  var base = new Base({
    b: true
  })
  const b = base.b
  base.move('b', 'c')
  t.equal(base.c, b, 'moved property')
  t.equal(base.b, null, 'removed b')
  t.same(base.keys(), [ 'c' ], 'correct keys')
  t.end()
})
