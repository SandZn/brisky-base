'use strict'
const test = require('tape')
const Base = require('../')

//  get (path, set, stamp) {
test('get', function (t) {
  const a = new Base({
    b: {
      c: {
        d: 'hello'
      },
      e: true
    },
    e: 'hello',
    something: true
  })
  t.equal(a.get('b.c.d'), a.b.c.d, 'get b.c.d using dot notation')
  t.equal(a.get('b.c.x.y.z', 'haha').val, 'haha', 'get a.b.c.x using a default')
  t.end()
})
