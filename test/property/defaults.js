'use strict'
const test = require('tape')
const Base = require('../../')

test('property - defaults - origin', function (t) {
  const a = new Base()
  const b = new Base(a)
  b.set({ origin: 1 })
  t.equal(a.val, 1, 'a.val equals 1')
  t.end()
})

test('property - defaults - reset', function (t) {
  const base = new Base({
    a: true,
    b: true,
    c: true
  })
  base.set({ reset: true })
  t.same(base.keys(), false, 'removes all keys')
  t.end()
})

test('property - defaults - inject', function (t) {
  const base = new Base({
    a: true,
    inject: { a: 'hello' }
  })
  t.equal(base.a.val, 'hello', 'injects object')
  const inject = base.inject
  base.set({
    define: {
      inject () {
        t.equal(arguments[arguments.length - 1], 'stamp!', 'passes stamp as last argument')
        return inject.apply(this, arguments)
      }
    },
    inject: [
      { b: 'bla' },
      { a: 'blurf' }
    ]
  }, 'stamp!')
  t.equal(base.a.val, 'blurf', 'injected a using array')
  t.equal(base.b.val, 'bla', 'injected b using array')
  t.end()
})

test('property - defaults - define', function (t) {
  const base = new Base({
    a: true,
    define: { a () {} }
  })
  t.equal(typeof base.a, 'function', 'define a method')
  base.set({
    define: [
      { b: 'bla' },
      { a: 'blurf' }
    ]
  })
  t.equal(base.a, 'blurf', 'defined a using array')
  t.equal(base.b, 'bla', 'defined b using array')
  t.end()
})

// test('property - defaults - isProperty', function (t) {
//   t.plan(1)
//   const base = new Base({
//     a: true
//   })
//   t.same(base.keys(), [], 'removes all keys')
// })
