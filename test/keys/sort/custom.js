'use strict'
const test = require('tape')
const Base = require('../../../')
// const sort = require('../../../lib/keys/sort')
// const update = require('../../../lib/keys/sort/update')

test('keys - sort - custom', (t) => {
  const base = new Base({
    sort: {
      val: 'nr',
      method (a, b) {
        return b > a ? 1 : -1
      }
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

// test('keys - sort - alphabetical', (t) => {
//   const expected = [
//     'a', 'A', 'a1', 'a2', 'a10', 'z', 'Z', 1, 2, 11, 22, '!', '?', '~'
//   ]
//   const base = new Base({
//     sort: 'sortKey',
//     inject: toSetObject(expected.slice().reverse())
//   })

//   t.same(
//     base.keys().map((key) => base[key].sortKey.compute()),
//     expected,
//     'sort in alphabetical order'
//   )
//   t.end()
// })

// function toSetObject (array) {
//   return array.reduce((o, val, i) => {
//     o[i] = { sortKey: val }
//     return o
//   }, {})
// }
