'use strict'
const test = require('tape')
const Base = require('../')

test('inject - object', t => {
  const injectable = {
    val: 'hello'
  }
  const a = Base({ inject: injectable })
  t.equal(a.val, 'hello', 'injected val')
  a.val = 'bye'
  a.inject(injectable, false) // false is the stamp
  t.equal(a.val, 'bye', 'did not inject injectable a second time')
  const b = new a.Constructor()
  b.inject(injectable)
  t.equal(b.val, 'bye', 'did not inject injectable a second time on instance b')
  t.end()
})

test('inject - function', t => {
  const injectable = (base) => {
    base.set('hello')
  }
  const a = Base({ inject: injectable })
  t.equal(a.val, 'hello', 'injected val')
  a.val = 'bye'
  a.inject(injectable, false)
  t.equal(a.val, 'bye', 'did not inject injectable a second time')
  const b = new a.Constructor()
  b.inject(injectable)
  t.equal(b.val, 'bye', 'did not inject injectable a second time on instance b')
  t.end()
})
