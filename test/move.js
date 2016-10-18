'use strict'
const test = require('tape')
const Base = require('../')

test('move', t => {
  var base = Base({
    b: true,
    d: {
      noReference: null
    }
  })

  const b = base.b
  base.move('b', 'c')
  t.equal(base.c, b, 'moved property')
  t.equal(base.b, null, 'removed b')
  t.same(base.keys(), [ 'd', 'c' ], 'correct keys')
  t.equal(base.c.noReference, void 0, 'b does not have noReference')
  base.move('d', 'e')
  t.equal(base.e.noReference, null, 'e has noReference null')
  t.end()
})
