'use strict'
const test = require('tape')
const Base = require('../../')

test('context - apply and resolve', function (t) {
  const base = new Base({
    a: {
      b: {
        c: true
      }
    },
    define: {
      inspect () {
        return ''
      }
    }
  })
  const base2 = new base.Constructor({ key: 'base2' })
  const a = base2.a
  const b = base2.a.b
  const c = base2.a.b.c
  const stored = base2.a.b.c.storeContext()
  t.equal(a.__c, base2, 'context on "a"')
  base.a.b.c
  t.equal(a.__c, null, 'no context on "a" after reference base')
  c.applyContext(stored)
  t.equal(a.__c, base2, 'context on "a" after applying context')
  t.equal(b.__c, base2, 'context on "b" after applying context')
  t.equal(c.__c, base2, 'context on "c" after applying context')
  base2.a.set('its my own')
  t.equal(base.a.__c, null, 'no context on "a" after resolve')
  c.applyContext(stored)
  t.equal(base2.a.__c, null, 'no context on "a" after applying context')
  t.end()
})
