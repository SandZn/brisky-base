'use strict'
const test = require('tape')
const base = require('../')
const Base = require('../base')

test('types - remove type property', t => {
  const Template = base({
    type: 'template'
  }).Constructor
  const TemplateA = new Template({
    key: 'TemplateA',
    properties: { type: null },
    child: {
      type: 'something',
      field: 'a field'
    },
    type: 'this is something'
  }).Constructor
  const a = new TemplateA()
  t.equals(
    a.type.type,
    'something',
    'a.type is an instance of child with type something'
  )
  t.equals(a.type.val, 'this is something', 'a.type has a correct input value')
  const TemplateB = new Template({
    properties: {
      type: base({ type: 'special' })
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
  const c = base({ special: true })
  const d = base({ specialD: true })
  const a = base({
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
    d: d,
    base: Base.prototype
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
  const a4 = base({
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
    b: true,
    base: Base.prototype
  }, 'use array notation, merge to non-object')
  t.end()
})

test('types - inheritance', function (t) {
  const a = base({
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

test('types - share object types constructors', function (t) {
  const a = { val: 'a' }
  const b = base({
    types: { a: a },
    a: { type: 'a' }
  })
  const c = base({
    types: { a: a },
    a: { type: 'a' }
  })
  t.equal(c.types.a, b.types.a, 'shares constructors')
  t.end()
})

test('types - create types - merge', function (t) {
  const obj = base({
    types: {
      a: {
        text: 'hello'
      }
    }
  })
  obj.set({
    types: {
      a: {
        yuzi: 'hello'
      }
    }
  })
  obj.set({
    bla: {
      type: 'a'
    }
  })
  t.same(obj.bla.serialize(), {
    yuzi: 'hello',
    text: 'hello'
  }, 'merges')
  t.end()
})
