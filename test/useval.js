'use strict'
const test = require('tape')
const Base = require('../')

test('useval', function (t) {
  const a = new Base({
    val: 'a',
    useVal: true
  })
  const b = new a.Constructor()
  const c = new Base({ b: b })
  t.plan(2)
  t.equal(c.b, b, 'inherited useVal')
})
