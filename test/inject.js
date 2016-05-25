'use strict'
const test = require('tape')
const Base = require('../')

test('inject - object', function (t) {
  const injectable = {
    val: 'hello'
  }
  const a = new Base({ inject: injectable })
  t.equal(a.val, 'hello', 'injected val')
  a.val = 'bye'
  a.inject(injectable, false) // false is the stamp
  t.equal(a.val, 'bye', 'did not inject injectable a second time')
  const b = new a.Constructor()
  b.inject(injectable)
  t.equal(b.val, 'bye', 'did not inject injectable a second time on instance b')
  t.end()
})

test('inject - function', function (t) {
  const injectable = (base) => {
    base.set('hello')
  }
  const a = new Base({ inject: injectable })
  t.equal(a.val, 'hello', 'injected val')
  a.val = 'bye'
  a.inject(injectable, false)
  t.equal(a.val, 'bye', 'did not inject injectable a second time')
  const b = new a.Constructor()
  b.inject(injectable)
  t.equal(b.val, 'bye', 'did not inject injectable a second time on instance b')
  t.end()
})

test('inject - mixin', function (t) {
  const injectMethod = function () {}
  const aMethod = function () {}
  const special = new Base({ type: 'special!' })
  const injectable = new Base({
    define: {
      method: injectMethod,
      something: {
        value: 'it\'s something!',
        writable: false,
        configurable: false
      }
    },
    field: 'this is a base',
    anotherfield: 'this is a base',
    properties: {
      specialProperty (val) {
        this.haha = val
      },
      define: {
        special: {
          val: special,
          key: 'weird'
        },
        hello: {
          val: true,
          key: 'bye'
        }
      }
    },
    special: 'hello',
    val: 'hello',
    hello: 'greeting'
  })
  const a = new Base({
    define: { method: aMethod },
    anotherfield: 'another!',
    inject: injectable
  })
  t.equal(a.anotherfield.val, 'this is a base', 'a.anotherfield equals this is a base')
  t.equal(a.val, 'hello', 'a val equals hello')
  // so whats this bullcrap!
  t.equal(a.bye, 'greeting', 'bye val equals greeting')
  a.set({ 'hello': 'hello' })
  t.equal(a.bye, 'hello', 'primitive property is inherited')
  t.equal(a.something, 'it\'s something!', 'defined property something from injectable')
  try {
    a.something = 'nothing'
  } catch (e) {
    t.equal(/read only property/.test(e.message), true, 'inherited property descriptors')
  }
  t.equal(a.method, injectMethod, 'existing descriptors get overwritten by injectable')
  t.equal(
    a.field instanceof injectable.field.Constructor,
    true,
    'a.field is an instance of injectable.field'
  )
  a.set({ specialProperty: 'hello' })
  t.equal(a.haha, 'hello', 'inherited property definitions')
  a.field.set('field a')
  a.val = 'bye'
  a.inject(injectable.Constructor)
  t.equal(a.val, 'bye', 'a val equals bye')
  t.equal(
    a.field.val,
    'field a',
    'does not inject injectable a second time when used as a constructor'
  )
  t.equal(a.weird instanceof special.Constructor, true, 'merged property override')
  t.end()
})
