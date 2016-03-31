'use strict'
const test = require('tape')
const Base = require('../')

test('noReference', function (t) {
  const a = new Base({
    val: 'a',
    noReference: true,
    b: { val: 'b', noReference: true }
  })
  const b = new a.Constructor()
  const c = new Base({ b: b })
  const d = new Base(c.b)
  const abInstance = new a.b.Constructor()
  const e = new Base({ key: 'e', b: abInstance })

  t.plan(3)
  t.equal(c.b, b, 'inherited noReference')
  t.equal(d.val, c.b, 'make a reference to a noReference base when it has its own parent (no move)')
  t.equal(e.b, abInstance, 'do not make a reference to a noReference base nested instance')
})
