'use strict'
const test = require('tape')
const Base = require('../')

test('inject - basic', function (t) {
  const injectable = {
    val: 'hello'
  }
  const a = new Base({ inject: injectable })
  t.equal(a.val, 'hello', 'injected val')
  a.val = 'bye'
  a.inject(injectable, false) // false is the stamp
  t.equal(a.val, 'bye', 'did not inject injectable a second time')
  const b = new a.Constructor()
  b.inject(injectable) // false is the stamp
  t.equal(b.val, 'bye', 'did not inject injectable a second time on instance b')
  t.end()
})

test('inject - mixin', function (t) {
  // property mixin ofc
  const injectable = new Base({
    define: {
      something: {
        value: 'it\'s something!',
        writable: false,
        configurable: false
      }
    },
    field: 'this is a base',
    properties: {
      specialProperty (val) {
        this.haha = val
      }
    }
  })
  const a = new Base({ inject: injectable })
  t.equal(a.something, 'it\'s something!', 'defined property something from injectable')
  try {
    a.something = 'nothing'
  } catch (e) {
    t.equal(/read only property/.test(e.message), true, 'inherited property descriptors')
  }
  t.equal(
    a.field instanceof injectable.field.Constructor,
    true,
    'a.field is an instance of injectable.field'
  )

  t.end()
})
