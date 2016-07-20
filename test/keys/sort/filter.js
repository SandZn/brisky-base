'use strict'
const test = require('tape')
const Base = require('../../../')

test('keys - sort - basic - sort with a filter', (t) => {
  const base = new Base({
    black: {},
    define: {
      filter (key) {
        console.log(key)
        if (
          key !== 'black' && key !== 'white'
        ) {
          return true
        }
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
  t.end()
})
