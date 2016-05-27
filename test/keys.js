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
  t.plan(2)
  const base = new Base({
    properties: {
      something: {
        keyType: 'somethings'
      }
    },
    define: {
      keysFilter (key) {
        return !this[key].keyType
      }
    },
    etc: true,
    something: true
  })
  t.same(base.keys(), [ 'etc' ], 'correct normal keys')
  t.same(base.keys('somethings'), [ 'something' ], 'correct "somethings" keys')

  // now add / remove etc
  // for obs we just need to check for !-- emitters and [0] !== $
  // make extedn ultra fast to make this kind of stuff easier ot do
  // can also do creation or something
  // remove erbij alles
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
