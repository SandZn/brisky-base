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
    define: { inspect () { return '' } }
  })

  const base2 = new base.Constructor({ key: 'base2' })
  var a = base2.a
  var b = base2.a.b
  var c = base2.a.b.c
  var context = base2.a.b.c.storeContext()
  t.equal(a.__c, base2, 'context on "a"')
  base.a.b.c
  t.equal(a.__c, null, 'no context on "a" after reference base')
  var val = c.applyContext(context)
  t.equal(val, void 0, 'applyContext returns undefined when nothing is changed')
  t.equal(a.__c, base2, 'context on "a" after applying context')
  t.equal(b.__c, base2, 'context on "b" after applying context')
  t.equal(c.__c, base2, 'context on "c" after applying context')
  base2.a.set('its my own')
  t.equal(base.a.__c, null, 'no context on "a" after resolve')
  val = c.applyContext(context)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  t.equal(b.__c, base2.a, 'context on "b" after applying context')
  t.equal(c.__c, base2.a, 'context on "c" after applying context')
  t.equal(base2.a.__c, null, 'no context on "base2.a" after applying context')

  const base3 = new base.Constructor({ key: 'base3' })
  a = base3.a
  b = base3.a.b
  c = base3.a.b.c
  context = base3.a.b.c.storeContext()
  base3.a.b.set('its my own')
  val = c.applyContext(context)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  t.equal(b.__c, null, 'no context on "b" after applying context')
  t.equal(c.__c, base3.a.b, 'context on "c" after applying context')
  t.equal(base3.a.__c, null, 'no context on "base3.a" after applying context')

  const base4 = new base.Constructor({ key: 'base4' })
  a = base4.a
  context = base4.a.storeContext()
  base4.a.set('its my own')
  val = a.applyContext(context)
  t.ok(a !== base4.a, 'created new instance for base4.a')
  t.equal(val, base4.a, 'applyContext returns new base')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')

  const base5 = new base.Constructor({ key: 'base5' })
  a = base5.a
  b = base5.a.b
  context = base5.a.b.storeContext()
  base5.a.remove()
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of a field leading to the target')
  t.equal(b.__c, null, 'no context on "b" after applying context')

  const base6 = new base.Constructor({ key: 'base5' })
  a = base6.a
  b = base6.a.b
  context = base6.a.b.storeContext()
  base6.a.b.remove()
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of the target')
  t.equal(b.__c, null, 'no context on "b" after applying context')

  const base7 = new base.Constructor({ key: 'base5', a: {} })
  a = base7.a
  b = base7.a.b
  context = base7.a.b.storeContext()
  base7.a.remove()
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of the toplevel of target')
  t.end()
})

// double test
test('context - apply and resolve (double) - simple resolve', function (t) {
  const base = new Base({
    a: {
      b: {
        c: true
      }
    }
  })
  const instance = new base.Constructor()
  const stored = instance.a.b.c.storeContext()
  instance.a.b.c.set(false)
  instance.a.b.c.applyContext(stored)
  t.equal(instance.a.b.c.__c, null, 'dont restore context on a resolved field')
  t.end()
})

test('context - apply and resolve (double)', function (t) {
  const b = new Base({
    val: 'b',
    key: 'B',
    nestB: 'nestB',
    noReference: true,
    define: { inspect () { return '' } }
  })
  const c = new Base({ key: 'c', cA: { cB: new b.Constructor() } })
  var base = c.cA.cB.nestB
  var context = base.storeContext()
  base.clearContext()
  var val = base.applyContext(context)
  t.same(val, void 0, 'val is "undefined" for "c"')
  t.same(base.path(), [ 'c', 'cA', 'cB', 'nestB' ], 'applied correct context on "c"')

  const d = new c.Constructor({ key: 'd' })
  base = d.cA.cB.nestB
  t.same(base.path(), [ 'd', 'cA', 'cB', 'nestB' ], '"d" has correct context')
  context = base.storeContext()
  base.clearContext()
  val = base.applyContext(context)
  t.same(val, void 0, 'val is "undefined" for "d"')
  t.same(base.path(), [ 'd', 'cA', 'cB', 'nestB' ], 'applied correct context on "d"')
  c.cA.cB.nestB.set('c')
  val = base.applyContext(context)
  t.same(
    base.path(),
    [ 'B', 'nestB' ],
    'set "c" cleared context for "base" (no longer a valid target)'
  )
  t.same(
    val.path(),
    [ 'd', 'cA', 'cB', 'nestB' ],
    'applied correct context on "c.cA.cB.nestB"'
  )
  t.same(val, c.cA.cB.nestB, 'val is "c.cA.cB.nestB" for "d"')
  base = d.cA.cB.nestB
  context = base.storeContext()
  d.cA.cB.nestB.set('d')
  val = base.applyContext(context)
  t.same(
    base.path(),
    [ 'c', 'cA', 'cB', 'nestB' ],
    'set "d" cleared context for "base" (no longer a valid target)'
  )
  t.same(
    val.path(),
    [ 'd', 'cA', 'cB', 'nestB' ],
    'applied correct context on "d.cA.cB.nestB"'
  )

  const e = new c.Constructor({ key: 'e' })
  base = e.cA.cB.nestB
  context = base.storeContext()
  c.cA.cB.nestB.remove()
  val = base.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of "c.cA.cB.nestB"')

  t.end()
})
