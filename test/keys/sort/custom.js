'use strict'
const test = require('tape')
const Base = require('../../../')
const natural = require('string-natural-compare')
// const sort = require('../../../lib/keys/sort')
// const update = require('../../../lib/keys/sort/update')

test('keys - sort - custom', (t) => {
  const base = new Base({
    sort: {
      val: 'nr',
      exec: (a, b) => b > a ? 1 : -1
    },
    a: { nr: 10 },
    b: { nr: 50 },
    z: { nr: 100 }
  })
  const result = [ 'z', 'b', 'a' ]
  result._ = [ 100, 50, 10 ]
  t.same(base.keys(), result, 'inverse sort')
  t.end()
})

test('keys - sort - alphabetical', (t) => {
  const expected = [
    'A', 'X', 'a', 'X10', 'a10', 'a2', 'a1', 'Z', 'z'
  ]
  const base = new Base()
  base.set(expected)
  base.set({
    sort: {
      val: 'val',
      exec: natural.caseInsensitive
    }
  })
  t.same(
    base.keys().map((key) => base[key].compute()),
    expected.sort(natural.caseInsensitive),
    'sort in using external compare'
  )
  t.end()
})
