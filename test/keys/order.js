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
  const result = [ 'a', 'b', 'c', 'd', 'e' ]
  result._ = [ 1, 2, 3, 4, 5 ]
  t.same(base.keys(), result, 'correct order')

  const reorder = [ 'e', 'd', 'c', 'b', 'a' ]
  reorder._ = [ 'aa', 'ab', 'ac', 'ad', 'ae' ]
  base.set({ sort: 'field' })
  t.same(base.keys(), reorder, 'resort')
  t.end()
})
