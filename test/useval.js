'use strict'
const test = require('tape')
const Base = require('../')

test('useval', function (t) {
  const a = new Base({
    val: 'a',
    useVal: true,
    b: { val: 'b', useVal: true }
  })
  const b = new a.Constructor()
  const c = new Base({ b: b })
  t.plan(4)
  t.equal(c.b, b, 'inherited useVal')
  const specialObj = { hello: true }
  c.set({ x: { useVal: specialObj } })
  t.equal(c.x, specialObj, 'setValue using useVal')
  const d = new Base(c.b)
  t.equal(d.val, c.b, 'make a reference to a useVal base')
  const abInstance = new a.b.Constructor()
  const e = new Base({ key: 'e', b: abInstance })
  t.equal(e.b, abInstance, 'make a reference to a useVal base nested instance')
})
