'use strict'
const test = require('tape')
const Base = require('../../')

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
