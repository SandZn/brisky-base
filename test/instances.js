'use strict'
const test = require('tape')
const base = require('../')

test('instances', t => {
  const obj = base()
  const instance = new obj.Constructor()
  const instance2 = new obj.Constructor()
  t.same(obj.instances, [ instance, instance2 ], '"obj" has correct instances array')
  t.same(instance.instances, null, '"instance" has correct instances array')
  instance.remove()
  t.same(obj.instances, [ instance2 ], '"obj" has correct instances array after remove')
  const instance3 = new instance2.Constructor()
  t.same(instance2.instances, [ instance3 ], '"instance2" has correct instances array after creation')
  t.end()
})
