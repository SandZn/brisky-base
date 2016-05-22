'use strict'
const test = require('tape')
const Base = require('../')

test('make references by using "$.field" notation', function (t) {
  const base = new Base({
    field: 'something',
    other: '$root.field'
  })
  t.equal(base.other.val, base.field, 'other equals field')
  const base2 = new Base({ field: { a: '$root.field.b' } })
  t.equal(base2.field.a.val, base2.field.b, 'field.a created a reference to field.b')
  base.set('other', '$root.field')
  t.equal(base2.field.a.val, base2.field.b, '"$root.field" notation works')
  base.set({
    field: {
      c: 'c',
      a: { b: '$.parent.parent.c' }
    },
    other: {
      0: '$.b'
    }
  })
  t.equal(base.field.a.b.val, base.field.c, '"$.parent.parent.c" notation works')
  t.equal(base.other[0].val, base.other[0].b, '"$.[field]" notation works')

  const a = new Base({
    etc: {},
    a: {
      b: {
        c: true
      }
    }
  })

  var special = new Base({
    other: {
      field: {
        noReference: true
      }
    }
  })
  a.set({
    etc: {
      a: {},
      gurk: new special.other.field.Constructor({
        val: '$.parent.a'
      }, false, a.etc, 'gurk')
    }
  })
  t.equal(a.etc.gurk.val, a.etc.a, 'creating a new instance using noReference')

  const b = new Base({
    properties: {
      x: {
        type: 'base',
        val: '$.parent.a'
      }
    },
    a: {}
  })
  t.equal(b.properties.x.base.val, b.a, 'using $.parent notation in a property definition')
  t.end()
})
