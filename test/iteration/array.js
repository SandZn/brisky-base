'use strict'
const test = require('tape')
const base = require('../../')

test('array - reduce', t => {
  const a = base({
    a: 'a',
    b: 'b',
    c: 'c'
  })

  const sum = a.reduce((acc, x) => acc + x.compute())
  t.same(sum, 'abc')
  t.end()
})

test('array - map', t => {
  const a = base({
    a: 'a',
    b: 'b'
  })
  const arr = a.map(val => val.compute())
  t.same(arr, [ 'a', 'b' ], 'returns mapped array')
  t.end()
})

test('array - filter', t => {
  const a = base({
    a: 'a',
    b: 'b'
  })
  const arr = a.map(val => val.compute() === 'a')
  t.same(arr, [ a.a ], 'returns filtered array')
  t.end()
})

test('array - forEach', t => {
  const a = base({
    a: 'a',
    b: 'b'
  })
  const ret = a.forEach(val => val.remove())
  t.equal(a.a, null, 'removed a')
  t.equal(a.b, null, 'removed b')
  t.same(ret, void 0, 'returns undefined')
  t.end()
})
