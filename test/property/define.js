'use strict'
const test = require('tape')
const Base = require('../../')

test('property - define - primitive', function (t) {
  t.plan(9)
  const a = new Base({
    properties: {
      val: { val: 'hello' },
      keepit: { val: 100 },
      field: { val: 200 },
      hello: '_hello',
      something: {
        override: 'blargh'
      }
    },
    Child: 'Constructor'
  })
  a.set({ b: {} })
  t.equals(a.hello, void 0, 'no field hello')
  t.equals(a.b.val, 'hello', 'correct val "hello"')
  t.equals(a.b.keepit, 100, 'correct keepit "100"')
  const b = new a.Constructor({
    key: 'b',
    keepit: 10,
    field: 300,
    something: 100,
    hello: 100
  })
  t.equals(b._hello, 100, 'a correct _hello "100"')
  t.equals(a.field, 200, 'a correct field "200"')
  t.equals(b.field, 300, 'b correct field "300"')
  t.equals(b.keepit, 10, 'b correct keepit "10"')
  t.equals(a.blargh, undefined, 'a.blargh is undefined')
  t.equals(b.blargh, 100, 'b correct blargh "100"')
})

test('property - define - null', function (t) {
  const a = new Base({
    properties: {
      val: null,
      something: new Base({ field: 'something' })
    },
    Child: 'Constructor'
  })
  const b = new a.Constructor(a)
  b.set({ c: void 0, val: 1 })
  t.equal(b.val instanceof Base, true, 'val is a normal base')
  t.equal(b.c instanceof Base, true, 'field c gets created')
  b.set({
    something: 'hello',
    properties: {
      something: null
    }
  })
  t.equal(b.something, null, 'removes base property')
  const c = new Base({
    properties: {
      something: 'else',
      thing: {
        val: new Base('a base'),
        override: 'thang'
      }
    },
    thing: 'hello'
  })
  t.equal(c.thang.val, 'hello', 'set thing to override thang')
  const overrides = c.properties._overrides
  c.set({
    properties: {
      something: null,
      thing: null
    }
  })
  t.equal(c.thang, null, 'removed thang')
  t.equal(c.else, null, 'removed else')
  t.equal(overrides.something, undefined, 'removed overrides something')
  t.equal(overrides.thing, undefined, 'removed overrides thing')
  t.equal(c.properties._overrides, undefined, 'remove overrides')
  t.end()
})

test('property - define - base', function (t) {
  t.plan(3)
  const a = new Base('a')
  const b = new Base('b')
  const c = new b.Constructor()
  const d = new Base({
    properties: {
      field: b,
      other: a,
      something: { val: c }
    }
  })
  t.equal(d.properties.something.base === c, true, 'use the same for c')
  t.equal(d.properties.other.base === a, true, 'use the same for a')
  t.equal(d.properties.field.base !== b, true, 'created a new instance for b')
})

test('property - define - custom type', function (t) {
  const b = new Base({
    types: {
      a: {
        val: 'hello!'
      }
    },
    properties: {
      something: { type: 'a' }
    },
    something: {
      field: 'boring'
    }
  })
  t.equal(b.properties.something.base.val, 'hello!', 'created type a, correct base value')
  t.equal(b.something.val, 'hello!', 'something has correct property type')
  b.set({
    properties: {
      something: {
        hello: true
      }
    }
  })
  t.equals(b.something.hello.val, true, 'something has correct property type')
  b.set({
    properties: {
      something: {
        reset: true,
        val: 'murder',
        type: 'base'
      }
    }
  })
  t.equals(b.something, null, 'something is removed after reset of property something')
  b.set({
    properties: {
      something: {
        reset: true,
        val: 'murder'
      }
    }
  })
  t.equals(b.something, 'murder', 'something is reset after primitive reset')
  t.end()
})

test('property - define - set Child', function (t) {
  const a = new Base({
    properties: new Base('hello')
  })
  a.set({ b: {} })
  t.equal(a.b.val, 'hello', 'b, correct val "hello"')
  const Constructor = function (val) {
    this.val = val
  }
  Constructor.prototype.something = true
  a.b.properties = Constructor
  a.b.set({ c: true })
  t.equal(a.b.c.val, true, 'custom constructor, b.c, correct val "true"')
  t.equal(a.b.c.something, true, 'custom constructor, b.c, has field something')
  t.end()
})

test('property - define - wrong property type error', function (t) {
  t.plan(1)
  try {
    new Base({ properties: { val: void 0 } }) // eslint-disable-line
  } catch (e) {
    t.equal(
      e.message,
      'base.properties - uncaught property type val: "undefined"'
    )
  }
})

test('property - define - wrong type on properties', function (t) {
  t.plan(1)
  try {
    new Base({ properties: true }) // eslint-disable-line
  } catch (e) {
    t.equal(
      e.message,
      '.properties need to be set with an object'
    )
  }
})
