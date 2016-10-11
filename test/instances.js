'use strict'
const test = require('tape')
const Base = require('../')

test('instances', function (t) {
  const base = Base()
  const instance = Base.Constructor()
  const instance2 = Base.Constructor()
  t.same(base.instances, [ instance, instance2 ], '"base" has correct instances array')
  t.same(instance.instances, null, '"instance" has correct instances array')
  instance.remove()
  t.same(base.instances, [ instance2 ], '"base" has correct instances array after remove')
  const instance3 = new instance2.Constructor()
  t.same(instance2.instances, [ instance3 ], '"instance2" has correct instances array after creation')
  t.end()
})
