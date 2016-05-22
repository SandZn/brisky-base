'use strict'
var test = require('tape')
var Base = require('../')

test('types - remove type property', function (t) {
  const Template = new Base({
    type: 'template'
  }).Constructor
  const TemplateA = new Template({
    key: 'TemplateA',
    properties: { type: null },
    Child: {
      type: 'something',
      field: 'a field'
    },
    type: 'this is something'
  }).Constructor
  const a = new TemplateA()
  t.equals(
    a.type.type,
    'something',
    'a.type is an instance of Child with type something'
  )
  t.equals(a.type.val, 'this is something', 'a.type has a correct input value')
  const TemplateB = new Template({
    properties: {
      type: new Base({ type: 'special' })
    }
  }).Constructor
  const b = new TemplateB({ type: 'this is special' })
  t.equals(
    b.type.val,
    'this is special',
    'b.type has a correct input value'
  )
  t.equals(b.type.type, 'special', 'b.type has type "special"')
  t.end()
})

test('types - create types', function (t) {
  const c = new Base({ special: true })
  const d = new Base({ specialD: true })
  const a = new Base({
    types: {
      b: {
        field: true,
        extra: true
      },
      c: c,
      d: d
    }
  })
  const a2 = new a.Constructor({
    types: {
      b: {
        field: false,
        field2: true
      }
    }
  })
  t.same(a2.types, {
    b: {
      field: false,
      field2: true,
      extra: true
    },
    c: c,
    d: d
  }, 'merges object')
  const a3 = new a.Constructor({
    types: { d: { val: 'lulz' } }
  })
  t.same(
    a3.types.d.serialize(),
    {
      val: 'lulz',
      specialD: true
    },
    'injects for base types'
  )
  const a4 = new Base({
    types: [ { a: true }, { b: true } ]
  })
  a4.set({
    types: {
      a: { bla: true }
    }
  })
  t.same(a4.types, {
    a: {
      val: true,
      bla: true
    },
    b: true
  }, 'use array notation, merge to non-object')
  t.end()
})

test('types - inheritance', function (t) {
  const a = new Base({
    types: {
      special: 'hello',
      something: {
        type: 'special'
      }
    }
  })
  a.set({
    field: {
      type: 'something',
      field: 'hello'
    }
  })
  t.same(a.serialize(), {
    field: {
      field: 'hello',
      val: 'hello'
    }
  }, 'something inherits from special')
  t.end()
})
