'use strict'
const test = require('tape')
const Base = require('../../')

test('keys - sort - instances', (t) => {
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

test('keys - sort - alphabetical', (t) => {
  const expected = [
    'a' ,'A', 'a1', 'a2', 'a10', 'z', 'Z', 1, 2, 11, 22, '!', '?', '~' 
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

test('keys - sort - references', (t) => {
  const expected = [ 1, 2, 3, 30, 55 ]
  const base = new Base({
    referenced: toSetObject(expected.slice().reverse()),
    references: {
      sort: 'sortKey',
      a: '$root.referenced.0',
      b: '$root.referenced.1',
      c: '$root.referenced.2',
      d: '$root.referenced.3',
      e: '$root.referenced.4'
    }
  })
  const references = base.references
  t.same(
    references.keys().map((key) => references[key].origin().sortKey.compute()),
    expected,
    'sort on property in referenced objects'
  )
  t.end()
})


function toSetObject (array) {
  return array.reduce((o, val, i) => {
    o[i] = { sortKey: val }
    return o
  }, {})
}
