'use strict'
const test = require('tape')
const Base = require('../../../')
// const stringNatural = require('string-natural-compare')
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
    'X', 'a', 'A', 'a1', 'a2', 'a10', 'z', 'Z'
  ]
  const base = new Base(expected.map((val) => { return { sortKey: val } }))
  console.log(base.keys())
  console.log(base.keys().map((key) => base[key].sortKey.compute()))

  t.same(
    base.keys().map((key) => base[key].sortKey.compute()),
    expected,
    'sort in alphabetical order'
  )
  t.end()
})
