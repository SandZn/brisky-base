'use strict'
const test = require('tape')
const Base = require('../')

test('lookUp', t => {
  const a = Base({
    b: {
      c: {
        d: true
      },
      e: true
    },
    e: 'hello',
    something: true
  })
  t.equal(a.something.lookUp('b.c.d'), a.b.c.d, 'gets parent.b.c.d')
  t.equal(
    a.something.lookUp([ 'b', 'c', 'd' ]),
    a.b.c.d,
    'gets parent.b.c.d using array notation'
  )
  t.equal(a.b.c.d.lookUp('something'), a.something, 'gets something')
  t.equal(a.b.c.d.lookUp('e'), a.b.e, 'gets e')
  t.equal(a.b.c.d.lookUp('e', function (result) {
    if (result.val === 'hello') {
      return result
    }
  }), a.e, 'gets top e using filter')
  t.equal(a.b.c.d.lookUp('e', /^hell/), a.e, 'gets top e using regExp')
  t.equal(a.b.c.d.lookUp('e', 'hello'), a.e, 'gets top e using primitive')
  t.equal(a.b.c.d.lookUp('e', [ 'hello', 'flabber' ]), a.e, 'gets top e using array')
  t.end()
})
