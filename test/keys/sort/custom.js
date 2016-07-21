'use strict'
const test = require('tape')
const Base = require('../../../')
// const sort = require('../../../lib/keys/sort')
// const update = require('../../../lib/keys/sort/update')

test('keys - sort - alphabetical', (t) => {
  const expected = [
    'a', 'A', 'a1', 'a2', 'a10', 'z', 'Z', 1, 2, 11, 22, '!', '?', '~'
  ]
  const base = new Base({
    sort: 'sortKey',
    inject: toSetObject(expected.slice().reverse())
  })

  t.same(
    base.keys().map((key) => base[key].sortKey.compute()),
    expected,
    'sort in alphabetical order'
  )
  t.end()
})

function toSetObject (array) {
  return array.reduce((o, val, i) => {
    o[i] = { sortKey: val }
    return o
  }, {})
}
