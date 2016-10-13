'use strict'
const test = require('tape')
const base = require('../')

test('references - "$.field" notation', t => {
  const obj = base({
    field: 'something',
    other: '$root.field'
  })
  t.equal(obj.other.val, obj.field, 'other equals field')
  const obj2 = base({ field: { a: '$root.field.b' } })
  t.equal(obj2.field.a.val, obj2.field.b, 'field.a created a reference to field.b')
  obj.set('other', '$root.field')
  t.equal(obj2.field.a.val, obj2.field.b, '"$root.field" notation works')
  obj.set({
    field: {
      c: 'c',
      a: { b: '$.parent.parent.c' }
    },
    other: {
      0: '$.b'
    }
  })
  t.equal(obj.field.a.b.val, obj.field.c, '"$.parent.parent.c" notation works')
  t.equal(obj.other[0].val, obj.other[0].b, '"$.[field]" notation works')

  const a = base({
    etc: {},
    a: {
      b: {
        c: true
      }
    }
  })

  var special = base({
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

  const b = base({
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

test('references - "$.field[0]"', t => {
  var consolevalue
  const rconsole = console.log
  console.log = val => {
    consolevalue = val
  }
  const obj = base({
    field: {
      hello: 1,
      bye: 2,
      blurf: 3
    },
    other: {}
  })
  obj.other.set('$root.x.y[0]')
  t.equal(consolevalue, 'key notation - cant find key "[0]" in ""', 'logs warning on non-existing')
  obj.other.set('$root.field[0]')
  t.equal(obj.other.val, obj.field.hello, '"$root.field[0]" gets first key')
  obj.other.set('$root.field[-1]')
  t.equal(obj.other.val, obj.field.blurf, '"$root.field[-1]" gets last key')
  obj.other.set('$root.field[1]')
  t.equal(obj.other.val, obj.field.bye, '"$root.field[1]" gets second key')
  obj.other.set('$root.field[-2]')
  t.equal(obj.other.val, obj.field.bye, '"$root.field[-2]" gets second key')
  obj.other.set('$root.field[-10]')
  t.equal(consolevalue, 'key notation - cant find key "[-10]" in "field"', 'logs warning when unavailable')
  obj.other.set('$root.random[-10]')
  t.equal(consolevalue, 'key notation - cant find key "[-10]" in "random"', 'logs warning on non-existing')
  base({ field: { a: '$root.field.b[0]' } }) //eslint-disable-line
  t.equal(consolevalue, 'key notation - cant find key "[0]" in "field"', 'logs warning on non-existing')
  console.log = rconsole
  t.end()
})

test('references - isParent unequal case', rm t => {
  const obj = base({
    a: {
      b: {},
      c: {}
    }
  })
  obj.set({
    a: {
      c: {
        d: {
          x: '$root.a.b.d.thing'
        }
      }
    }
  })
  t.same(obj.a.c.d.x.val, obj.a.b.d.thing, 'correct reference')
  t.end()
})
