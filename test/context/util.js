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
  val = c.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal')
  t.equal(b.__c, null, 'no context on "b" after applying context')
  // add one more test thing it self if removed!
  t.end()
})

// // double test
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
  val = base.applyContext(context)
  t.same(val, void 0, 'val is "undefined" for "d"')
  t.same(base.path(), [ 'd', 'cA', 'cB', 'nestB' ], 'applied correct context on "d"')
  console.log(base.path())
  t.end()
})

// test('context - set restore - dont set context', function (t) {
//   const base = new Base({
//     a: {
//       b: {
//         c: true
//       }
//     }
//   })
//   const instance = new base.Constructor()
//   const stored = instance.a.b.c.storeContext()
//   instance.a.b.c.set(false)
//   instance.a.b.c.applyContext(stored)
//   t.equal(instance.a.b.c.__c, null, 'dont restore context on a resolved field')
//   t.end()
// })
