'use strict'
const test = require('tape')
const Base = require('../../')

test('keys - sort', (t) => {
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

test('keys - refrences', (t) => {
  const payload = {
    '1776869': {
      'publishedSort': 5,
      'val': '$root.content.shows.items.1242928.items.1673742.items.1776869'
    },
    '1789461': {
      'publishedSort': 0,
      'val': '$root.content.shows.items.1595901.items.1617711.items.1789461'
    },
    '1789718': {
      'publishedSort': 1,
      'val': '$root.content.shows.items.7087.items.1599749.items.1789718'
    },
    '1789721': {
      'publishedSort': 5,
      'val': '$root.content.shows.items.1578839.items.1599761.items.1789721'
    },
    '1790560': {
      'publishedSort': 9,
      'val': '$root.content.shows.items.7087.items.1599749.items.1790560'
    },
    '1790578': {
      'publishedSort': 7,
      'val': '$root.content.shows.items.7087.items.1599749.items.1790578'
    },
    '1793478': {
      'publishedSort': 6,
      'val': '$root.content.shows.items.7087.items.1599749.items.1793478'
    },
    '1793481': {
      'publishedSort': 0,
      'val': '$root.content.shows.items.1592893.items.1692126.items.1793481'
    },
    '1796073': {
      'publishedSort': 4,
      'val': '$root.content.shows.items.1242928.items.1673742.items.1796073'
    }
  }
  const base = new Base({
    items: { sort: 'publishedSort' }
  })
  base.items.set(payload)
  const keys = base.items.keys()
  t.same(keys.map((val) => base.items[val].publishedSort.compute()), [ 0, 0, 1, 4, 5, 5, 6, 7, 9 ])
  t.end()
})
