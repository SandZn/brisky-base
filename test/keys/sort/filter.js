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
  base2._keys._ = [] // not good...
  resort(base2, base2._keys, 'rick') // maybe make a resort option by default? 'true' that does the delete?
  t.same(base2.keys(), [ 'field2', 'bla', 'else', 'something', 'field' ], 'remove last field')
  base2.field2.rick.set(10000)
  update(base2.field2, 'rick')
  t.equal(base2._keys[0], 'white', 'update "field2" "_keys[0]" equals "white"')
  t.same(base2.keys(), [ 'bla', 'else', 'something', 'field', 'field2' ], 'update "field2"')
  base2.field.rick.set(-20000)
  update(base2.field, 'rick')
  t.same(base2.keys(), [ 'field', 'bla', 'else', 'something', 'field2' ], 'update "field" move to [0]')
  base2.something.rick.set(-20000)
  update(base2.something, 'rick')
  t.same(base2.keys(), [ 'something', 'field', 'bla', 'else', 'field2' ], 'update "something" move to [0] same order')
  base2.else.rick.set(10000)
  update(base2.else, 'rick')
  t.same(base2.keys(), [ 'something', 'field', 'bla', 'field2', 'else' ], 'update "else" move to end same order')
  t.end()
})

test('keys - sort - filter - instances', (t) => {
  const base = new Base({
    rick: {
      position: 1
    },
    escape_something: {
      position: 1
    },
    sort: 'position',
    define: {
      filter: (key) => !/^escape_/.test(key)
    }
  })
  const base2 = new base.Constructor({
    james: {
      position: 2
    }
  })
  t.same(base2.keys(), [ 'rick', 'james' ], 'initial')
  base.set({ youzi: { position: -1 } })
  t.same(base2.keys(), [ 'youzi', 'rick', 'james' ], 'add field to class')
  base.rick.position.set(4)
  update(base.rick, 'position')
  t.same(base2.keys(), [ 'youzi', 'james', 'rick' ], 'update position of field on class')
  t.end()
})
