'use strict'
const test = require('tape')
const Base = require('../../../')
const resort = require('../../../lib/keys/sort')
const update = require('../../../lib/keys/sort/update')

test('keys - sort - filter', (t) => {
  const base = new Base({
    black: {},
    define: {
      filter (key) {
        return key !== 'black' && key !== 'white' && key !== 'gurk' && key !== 'blurf'
      }
    }
  })
  const base2 = new base.Constructor({
    field: { rick: 10 },
    field2: { rick: 5 },
    sort: 'rick'
  })
  t.same(base2.keys(), [ 'field2', 'field' ], 'correct keys')
  base2.set({ bla: { rick: -1 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'field' ], 'add field at [0], correct result')
  base2.set({ white: { rick: -2 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'field' ], 'add field at blacklisted field')
  base2.set({ something: { rick: 7 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'something', 'field' ], 'add field at [3]')
  base2.set({ else: { rick: 6 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'else', 'something', 'field' ], 'add field at [3] again')
  base2.set({ gurk: { rick: 3 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'else', 'something', 'field' ], 'add blacklisted field at [3]')
  base2.set({ gurken: { rick: 5.1 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'gurken', 'else', 'something', 'field' ], 'add field at [3] again')
  base2.set({ blurf: { rick: 500 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'gurken', 'else', 'something', 'field' ], 'add blacklisted field at end')
  base2.set({ blurfx: { rick: 1e3 } })
  t.same(base2.keys(), [ 'bla', 'field2', 'gurken', 'else', 'something', 'field', 'blurfx' ], 'add field at end')
  base2.gurken.remove()
  t.same(base2.keys(), [ 'bla', 'field2', 'else', 'something', 'field', 'blurfx' ], 'remove "gurken" field')
  base2.blurfx.remove()
  t.same(base2.keys(), [ 'bla', 'field2', 'else', 'something', 'field' ], 'remove last field')
  base2.blurf.rick.set(10000)
  base2.field2.rick.set(-10000)
  base2.black.set({ rick: 200 })
  delete base2._keys._ // not good...
  resort(base2, base2._keys, 'rick')
  t.same(base2.keys(), [ 'field2', 'bla', 'else', 'something', 'field' ], 'remove last field')
  base2.field2.rick.set(10000)
  update(base2, base2._keys, 'field2', 'rick')
  t.end()
})

// test('keys - sort - filter - multiple', (t) => {

// })
