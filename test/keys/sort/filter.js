'use strict'
const test = require('tape')
const Base = require('../../../')

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
  t.end()
})
