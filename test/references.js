'use strict'
const test = require('tape')
const Base = require('../')

test('make references by using "$.field" notation', function (t) {
  const base = new Base({
    field: 'something',
    other: '$root.field'
  })
  t.plan(4)
  t.equal(base.other.val, base.field, 'other equals field')
  const base2 = new Base({ field: { a: '$root.field.b' } })
  t.equal(base2.field.a.val, base2.field.b, 'field.a created a reference to field.b')
  base.set('other', '$root.field')
  t.equal(base2.field.a.val, base2.field.b, '"$root.field" notation works')
  base.set({
    field: {
      c: 'c',
      a: { b: '$.parent.parent.c' }
    }
  })
  t.equal(base.field.a.b.val, base.field.c, '"$.parent.parent.c" notation works')
})
