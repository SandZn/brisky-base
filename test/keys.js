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
  t.same(base.keys('thing'), [ 'something' ], 'correct "thing" keys')

  base.set({ other: { type: 'thing' } })
  t.same(base.keys('thing'), [ 'something', 'other' ], 'correct "thing" keys after add')
  base.set({ something: null })
  t.same(base.keys('thing'), [ 'other' ], 'correct "thing" keys after remove')

  // now add creation etc
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
