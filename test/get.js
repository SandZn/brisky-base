'use strict'
const test = require('tape')
const Base = require('../')

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

test('get - keys notation', function (t) {
  const a = new Base({
    b: {
      c: {
        a: true,
        b: true,
        d: true
      },
      e: true
    },
    e: 'hello',
    something: true
  })
  t.equal(a.get('b.c[0]'), a.b.c.a, 'get b.c.a using key notation')
  t.equal(a.get('[0][0][0]'), a.b.c.a, 'get b.c.a using double key notation')
  t.end()
})

test('get - method support', function (t) {
  const a = new Base({ b: { c: true } })
  t.equal(a.get('b.origin.c.origin.compute'), true, 'get a.b.c. using origin')
  t.end()
})
