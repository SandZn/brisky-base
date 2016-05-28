'use strict'
const test = require('tape')
const isEmpty = require('vigour-util/is/empty')
const Base = require('../')

test('keys', function (t) {
  const base = new Base({
    a: true,
    b: true,
    val: 'something'
  })
  t.equal(base.keys().length, 2, 'correct length')
  base.removeProperty(base.a, 'a')
  t.equal(base.keys().length, 1, 'correct length after removal')
  base.setKey('c', true)
  t.equal(base.keys().length, 2, 'correct length after setKey')
  base.reset()
  t.equal(isEmpty(base), true, 'isEmpty === true after reset')
  t.equal(base.keys().length, 0, 'keys are false after reset')
  base.set({ d: true })
  t.equal(base.keys().length, 1, 'correct length after set')
  base.set({ c: null })
  t.equal(base.keys().length, 1, 'correct length after set with null')
  t.end()
})

test('keys - inheritance', function (t) {
  const BaseExample = new Base({
    something: true,
    hello: '?',
    child: 'Constructor'
  }).Constructor
  const a = new BaseExample({
    b: {
      c: {
        something: { hello: {} }
      }
    }
  })
  t.same(a.something.keys(), [], 'a keys are empty')
  t.same(a.b.something.keys(), [], 'a.b keys are empty')
  t.same(a.b.c.something.keys(), [ 'hello' ], 'a.b.c keys equal [ "hello" ]')

  const base = new Base({
    d: true
  })
  const instance = new base.Constructor({
    x: true, y: true, z: true, special: null
  })
  t.same(
    instance.keys(),
    [ 'd', 'x', 'y', 'z' ],
    'merge keys for instance'
  )
  base.set({ special: true, e: true, y: true })
  t.same(
    instance.keys(),
    [ 'd', 'x', 'y', 'z', 'e' ],
    'add "e", do not add "special" (nulled)'
  )
  base.d.remove()
  base.y.remove()
  t.same(
    instance.keys(),
    [ 'x', 'y', 'z', 'e' ],
    'removed "d", do not remove "y"'
  )
  const instance2 = new instance.Constructor({ b: true })
  t.same(
    instance2.keys(),
    [ 'x', 'y', 'z', 'e', 'b' ],
    'instance2 has correct keys'
  )
  base.set({ h: true })
  t.same(
    instance2.keys(),
    [ 'x', 'y', 'z', 'e', 'b', 'h' ],
    'after updating base instance2 has correct keys'
  )
  t.end()
})

test('ordered keys', function (t) {
  const base = new Base({
    sort: 'val',
    d: 4,
    b: 2,
    e: 5,
    a: 1,
    c: 3
  })
  const result = [ 'a', 'b', 'c', 'd', 'e' ]
  result._ = [ 1, 2, 3, 4, 5 ]
  t.same(base.keys(), result, 'correct order')
  t.end()
})

test('keys - filtered', function (t) {
  const base = new Base({
    types: {
      thing: {
        keyType: 'thing'
      }
    },
    define: {
      filter (key) {
        return !this[key].keyType
      }
    },
    etc: true,
    something: { type: 'thing' }
  })
  t.same(base.keys(), [ 'etc' ], 'correct normal keys')
  t.same(
    base.keys('thing'),
    [ 'something' ],
    'correct "thing" keys'
  )

  base.set({ other: { type: 'thing' } })
  t.same(
    base.keys('thing'),
    [ 'something', 'other' ],
    'correct "thing" keys after add'
  )
  base.set({ something: null })
  t.same(
    base.keys('thing'),
    [ 'other' ],
    'correct "thing" keys after remove'
  )

  const instance = new base.Constructor({
    bla: { type: 'thing' },
    field: true
  })
  t.same(
    instance.keys('thing'),
    [ 'other', 'bla' ],
    'correct "thing" keys on instance'
  )
  t.same(
    base.keys('thing'),
    [ 'other' ],
    'original did not get polluted by instance'
  )
  instance.set({ other: null })
  t.same(
    instance.keys('thing'),
    [ 'bla' ],
    'correct "thing" keys on instance after remove'
  )
  t.same(
    base.keys('thing'),
    [ 'other' ],
    'original did not get polluted by instance'
  )
  instance.reset()
  t.same(instance.keys('thing'), [], 'reset keys')
  t.same(base.keys('thing'), [ 'other' ], 'original did not get polluted by instance')
  t.end()
})

/*
  make mroe tests for filter inhertance
*/
