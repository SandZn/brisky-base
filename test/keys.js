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

// test('ordered keys', function (t) {
//   t.plan(2)
//   const base = new Base({
//     a: { val: true, order: 1 },
//     b: true,
//     c: { val: true, order: -1 }
//   })
//   t.same(base.keys(), [ 'c', 'b', 'a' ], 'correct order')
//   base.a.set({ order: -2 })
//   t.same(base.keys(), [ 'a', 'c', 'b' ], 're-order a')
// })

test('filtered keys', function (t) {
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
  console.log('yo wtf? instance does not call real remove...')
  // instance.other.remove()
  instance.set({ other: null })
  t.same(instance.keys('thing'), [ 'bla' ], 'correct "thing" keys on instance after remove')
  t.same(base.keys('thing'), [ 'other' ], 'original did not get polluted by instance')
  // instance.reset()
  // t.same(instance.keys('thing'), [], 'reset keys')
  // t.same(base.keys('thing'), [ 'other' ], 'original did not get polluted by instance')
  t.end()
})

// test('has correct keys inheritance', function (t) {
//   var BaseExample = new Base({
//     something: true,
//     hello: '?',
//     child: 'Constructor'
//   }).Constructor

//   var a = new BaseExample({
//     b: {
//       c: {
//         something: { hello: {} }
//       }
//     }
//   })
//   t.same(a.something.keys(), [], 'a keys are false')
//   t.same(a.b.something.keys(), [], 'a.b keys are false')
//   t.same(a.b.c.something.keys(), [ 'hello' ], 'a.b.c keys equal [ "hello" ]')
//   t.end()
// })

/*
  console.log(base._instances())

  // edge case where the orginal does not have filtered keys and the later gets them -- no inheritance for the instance
  console.log('INHERITANCE!')
  const a = new Base({
    types: {
      thing: {
        keyType: 'thing'
      }
    },
    a: true
  })

  const b = new a.Constructor({
    types: {
      bla: {
        keyType: 'bla'
      }
    },
    b: { type: 'bla' },
    c: true
  })

  const c = new b.Constructor({
    cSpecialKey: true
  })

  console.log(c.keys(), b.keys())

  a.set({
    thing: { type: 'thing' }
  })

  // need to support this unfortunately -- instance updates :/
  // best solution is to just clear everything in instances
  console.log(a.keys('thing'), b.keys('things'), c.keys())
  console.log(b.thing)
  console.log(a.keys(), b.keys())
*/
