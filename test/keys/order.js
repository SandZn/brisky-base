'use strict'
const test = require('tape')
const Base = require('../../')

test('ordered keys', function (t) {
  const base = new Base({
    sort: 'val',
    d: { val: 4, field: 'ab' },
    b: { val: 2, field: 'ad' },
    e: { val: 5, field: 'aa' },
    a: { val: 1, field: 'ae' },
    c: { val: 3, field: 'ac' }
  })
  const order = [ 'a', 'b', 'c', 'd', 'e' ]
  order._ = [ 1, 2, 3, 4, 5 ]
  t.same(base.keys(), order, 'correct order')
  const reorder = [ 'e', 'd', 'c', 'b', 'a' ]
  reorder._ = [ 'aa', 'ab', 'ac', 'ad', 'ae' ]
  base.set({ sort: 'field' })
  t.same(base.keys(), reorder, 'resort')
  base.b.remove()
  const remove = [ 'e', 'd', 'c', 'a' ]
  remove._ = [ 'aa', 'ab', 'ac', 'ae' ]
  t.same(base.keys(), remove, 'remove key')
  const instance = new base.Constructor({ z: { field: 'a' } })
  const instanceKeys = [ 'z', 'e', 'd', 'c', 'a' ]
  instanceKeys._ = [ 'a', 'aa', 'ab', 'ac', 'ae' ]
  t.same(instance.keys(), instanceKeys, 'instance - add')
  const instance2 = new base.Constructor({ a: null })
  const instanceKeys2 = [ 'e', 'd', 'c' ]
  instanceKeys2._ = [ 'aa', 'ab', 'ac' ]
  t.same(instance2.keys(), instanceKeys2, 'instance - remove')
  t.end()
})
