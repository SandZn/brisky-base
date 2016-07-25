'use strict'
const test = require('tape')
const Base = require('../../../')
const update = require('../../../lib/keys/sort/update')

test('keys - sort - basic - instances', (t) => {
  const base = new Base({
    sort: 'val',
    d: { val: 4, field: 2 },
    b: { val: 2, field: 4 },
    e: { val: 5, field: 1 },
    a: { val: 1, field: 5 },
    c: { val: 3, field: 3 },
    something: 6
  })
  const order = [ 'a', 'b', 'c', 'd', 'e', 'something' ]
  order._ = [ 1, 2, 3, 4, 5, 6 ]
  t.same(base.keys(), order, 'correct order')
  const reorder = [ 'something', 'e', 'd', 'c', 'b', 'a' ]
  reorder._ = [ 0, 1, 2, 3, 4, 5 ]
  base.set({ sort: 'field' })
  t.same(base.keys(), reorder, 'resort')
  base.b.remove()
  const remove = [ 'something', 'e', 'd', 'c', 'a' ]
  remove._ = [ 0, 1, 2, 3, 5 ]
  t.same(base.keys(), remove, 'remove key')
  const instance = new base.Constructor({ z: true })
  const instanceKeys = [ 'something', 'z', 'e', 'd', 'c', 'a' ]
  instanceKeys._ = [ 0, 0, 1, 2, 3, 5 ]
  t.same(instance.keys(), instanceKeys, 'instance - add without field')
  instance.set({
    'x': { field: -1 }
  })
  instanceKeys.unshift('x')
  instanceKeys._.unshift(-1)
  t.same(instance.keys(), instanceKeys, 'instance - add with a field')
  const instance2 = new base.Constructor({ a: null })
  const instanceKeys2 = [ 'something', 'e', 'd', 'c' ]
  instanceKeys2._ = [ 0, 1, 2, 3 ]
  t.same(instance2.keys(), instanceKeys2, 'instance - remove')
  instance2.set({ sort: null })
  t.equal('_' in instance2._keys, false, 'removed order cache')
  t.end()
})

test('keys - sort - basic - single sort index map', (t) => {
  const base = new Base({
    field: {
      rick: 10
    }
  })

  const base2 = new base.Constructor({
    sort: 'rick'
  })

  t.same(base2.keys()[0], 'field', 'correct keys')

  t.same(
    base2._keys._,
    [ 10 ],
    'has correct keys order index map'
  )
  t.end()
})

test('keys - sort - basic - references - property on referenced objects', (t) => {
  const expected = [ 1, 2, 3, 30, 55 ]
  const base = new Base({
    referenced: (expected.map((val) => { return { sortKey: val } })).reverse(),
    references: {
      sort: 'sortKey',
      a: '$root.referenced.0',
      b: '$root.referenced.1',
      d: '$root.referenced.3',
      c: '$root.referenced.2',
      e: '$root.referenced.4'
    }
  })
  const references = base.references

  const result = references.keys().map((key) => references[key].origin().sortKey.compute())

  t.same(
    result,
    expected,
    'sort on property in referenced objects'
  )
  t.end()
})

test('keys - sort - basic - references - property on referencer itself', (t) => {
  const base = new Base({
    referenced: [ 10, 20, 30, 40, 50 ].map((val) => { return { sortKey: val } }),
    references: {
      sort: 'sortKey',
      a: { val: '$root.referenced.4', sortKey: 5 },
      b: { val: '$root.referenced.3', sortKey: 4 },
      c: { val: '$root.referenced.2', sortKey: 3 }
    }
  })
  const references = base.references
  references.set({
    d: { val: '$root.referenced.1', sortKey: 2 },
    e: { val: '$root.referenced.0', sortKey: 1 }
  })
  t.same(
    references.keys().map((key) => references[key].sortKey.compute()),
    [ 1, 2, 3, 4, 5 ],
    'sort by key on the referencer {val: \'$root.ref\', sortKey: \'X\'}'
  )
  references.c.remove()
  t.same(references.keys()._, [ 1, 2, 4, 5 ], 'remove "references.c"')
  t.end()
})

test('keys - sort - update', (t) => {
  testUpdate([ 15, 18, 16 ], t)
  testUpdate([ 0, 3, 4, 4, 4, 5 ], t)
  testUpdate([ 2, 4, 17, 10, 12, 4, 15, 14, 6 ], t)
  testUpdate([ 2, 10, 1, 12, 5, 4, 8, 18, 6, 2, 10 ], t)
  testUpdate([ 1, 17, 7, 12, 1, 17, 2, 15, 4 ], t)
  testUpdate([ 7, 9, 14, 13, 2, 0, 1, 3, 8 ], t)
  testUpdate([ 2, 10, 1, 12, 5, 4, 8, 18, 6, 2, 10 ], t)
  testUpdate([ 1, 17, 7, 12, 1, 17, 2, 15, 4 ], t)
  testUpdate([ 9, 15, 15, 13, 2, 18 ], t)
  testUpdate([ 1, 19, 10, 11, 4, 9, 0, 12 ], t)
  t.end()
})

function testUpdate (updates, t) {
  const arr = []
  for (let i = 0; i < updates.length; i++) {
    arr.push(i)
  }
  const base = new Base({ sort: 'val' })
  base.set(arr)
  for (var i in updates) {
    base[i].set(updates[i])
    update(base[i], 'val')
  }
  updates.sort((a, b) => a < b ? -1 : b < a ? 1 : 0)
  t.same(base._keys._, updates, 'correct order after updates [ ' + updates.join(', ') + ' ]')
}

