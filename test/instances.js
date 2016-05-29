'use strict'
const test = require('tape')
const Base = require('../')

test('instances', function (t) {
  const base = new Base()
  const instance = new base.Constructor()
  const instance2 = new base.Constructor()
  t.same(base._instances, [ instance, instance2 ], '"base" has correct instances array')
  t.same(instance._instances, null, '"instance" has correct instances array')
  instance.remove()
  t.same(base._instances, [ instance2 ], '"base" has correct instances array after remove')
  const instance3 = new instance2.Constructor()
  t.same(instance2._instances, [ instance3 ], '"instance2" has correct instances array after creation')
  t.end()
})
