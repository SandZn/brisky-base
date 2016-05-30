'use strict'
const test = require('tape')
const Base = require('../../')

test('keys - filters', function (t) {
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
    x: true,
    something: { type: 'thing' }
  })
  t.same(base.keys(), [ 'etc', 'x' ], 'correct normal keys')
  t.same(
    base.keys('thing'),
    [ 'something' ],
    'correct "thing" keys'
  )

  base.x.remove()
  t.same(base.keys(), [ 'etc' ], 'correct normal keys after remove')

  base.set({ y: true })
  t.same(base.keys(), [ 'etc', 'y' ], 'correct normal keys after add')

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

test('keys - filters - remove key on new', function (t) {
  const a = new Base({
    a: true,
    b: true
  })
  a.keys('thing')
  const b = new a.Constructor({ a: null })
  t.same(b._filters, { thing: [] }, 'b has filter cache')
  // later put it all to false -- more smart
  t.equal(b.keys().length, 1, 'reset on new instance removes key')
  b.set({ thing: { keyType: 'thing' } })
  t.same(b.keys('thing'), [ 'thing' ], 'b has correct things keys')
  b.set({ thing: null })
  t.same(b.keys('thing'), [], 'b has empty thing')
  t.end()
})

test('keys - filters - null undefined key on instance', function (t) {
  const a = new Base({
    a: true,
    b: {
      keyType: 'thing'
    }
  })
  a.keys('thing')
  const b = new a.Constructor({ bla: null })
  t.equal(b.keys('thing').length, 1, 'remove bla (non existing)')
  t.equal(b.keys('thing') !== a.keys('thing'), true, 'copied filters')
  t.end()
})
