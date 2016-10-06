'use strict'
const test = require('tape')
const Base = require('../')

test('get', (t) => {
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

test('get - keys notation', (t) => {
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
  t.equal(a.get('[0][0].x[10]', 'value'), void 0, 'cannot set a non-existing index')
  t.end()
})

test('get - method support', (t) => {
  const a = new Base({ b: { c: true } })
  t.equal(a.get('b.origin.c.origin.compute'), true, 'get a.b.c. using origin')
  t.end()
})

test('get - root', (t) => {
  const base = new Base({
    a: {
      b: {
        c: 'lulz'
      }
    },
    c: 'haha'
  })
  const a = new Base({ b: base.a.b.c })
  t.equal(a.get('b.origin.root.c.compute'), 'haha', 'get a.b.$root.c')
  t.equal(base.a.b.c.get('root.c.compute'), 'haha', 'get base.a.b.c.$root')
  t.end()
})

test('get - array', (t) => {
  const arr = ['a', 'b', 'c']
  const base = new Base()
  base.get(arr, true)
  t.equal(base.a.b.c.compute(), true, 'set a.b.c: true')
  t.same(arr, ['a', 'b', 'c'], 'array is unchanged')
  t.end()
})
