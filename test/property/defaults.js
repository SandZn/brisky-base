'use strict'
const test = require('tape')
const base = require('../../')

test('property - defaults - origin', t => {
  const a = base()
  const b = base(a)
  b.set({ origin: 1 })
  t.equal(a.val, 1, 'a.val equals 1')
  t.end()
})

test('property - defaults - reset', t => {
  const obj = base({
    a: true,
    b: true,
    c: true
  })
  obj.set({ reset: true })
  t.same(obj.keys().length, 0, 'removes all keys')
  t.end()
})

test('property - defaults - inject', t => {
  const obj = base({
    a: true,
    inject: { a: 'hello' }
  })
  t.equal(obj.a.val, 'hello', 'injects object')
  const inject = obj.inject
  obj.set({
    define: {
      inject () {
        t.equal(
          arguments[arguments.length - 1],
          'stamp!', 'passes stamp as last argument'
        )
        return inject.apply(this, arguments)
      }
    },
    inject: [
      { b: 'bla' },
      { a: 'blurf' }
    ]
  }, 'stamp!')
  t.equal(obj.a.val, 'blurf', 'injected a using array')
  t.equal(obj.b.val, 'bla', 'injected b using array')
  t.end()
})

test('property - defaults - define', t => {
  const obj = base({
    a: true,
    define: { a () {} }
  })
  t.equal(typeof obj.a, 'function', 'define a method')
  obj.set({
    define: [
      { b: 'bla' },
      { a: 'blurf' }
    ]
  })
  t.equal(obj.a, 'blurf', 'defined a using array')
  t.equal(obj.b, 'bla', 'defined b using array')
  t.end()
})
