'use strict'
const test = require('tape')
const Base = require('../')

test('references - "$.field" notation', function (t) {
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

test('references - "$.field[0]"', function (t) {
  // will not do anythign if field does not exist
  const base = new Base({
    field: {
      hello: 1,
      bye: 2,
      blurf: 3
    },
    other: {}
  })

  try {
    base.other.set('$root.x.y[0]')
  } catch (e) {
    t.equal(e.message, 'key notation - cant find key "[0]" in ""', 'throws error on non-existing')
  }
  base.other.set('$root.field[0]')
  t.equal(base.other.val, base.field.hello, '"$root.field[0]" gets first key')
  base.other.set('$root.field[-1]')
  t.equal(base.other.val, base.field.blurf, '"$root.field[-1]" gets last key')
  base.other.set('$root.field[1]')
  t.equal(base.other.val, base.field.bye, '"$root.field[1]" gets second key')
  base.other.set('$root.field[-2]')
  t.equal(base.other.val, base.field.bye, '"$root.field[-2]" gets second key')
  const rconsole = console.log
  var consolevalue
  console.log = function (val) {
    consolevalue = val
    rconsole.apply(this, arguments)
  }
  base.other.set('$root.field[-10]')
  t.equal(consolevalue, 'key notation - cant find key "[-10]" in "field"', 'logs warning when unavailable')
  base.other.set('$root.random[-10]')
  t.equal(consolevalue, 'key notation - cant find key "[-10]" in "random"', 'logs warning on non-existing')
  new Base({ field: { a: '$root.field.b[0]' } }) //eslint-disable-line
  t.equal(consolevalue, 'key notation - cant find key "[0]" in "field"', 'logs warning on non-existing')
  console.log = rconsole
  t.end()
})
