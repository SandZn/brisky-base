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
  var stored = base2.a.b.c.storeContext()
  t.equal(a.__c, base2, 'context on "a"')
  base.a.b.c
  t.equal(a.__c, null, 'no context on "a" after reference base')
  var val = c.applyContext(stored)
  t.equal(val, void 0, 'applyContext returns undefined when nothing is changed')
  t.equal(a.__c, base2, 'context on "a" after applying context')
  t.equal(b.__c, base2, 'context on "b" after applying context')
  t.equal(c.__c, base2, 'context on "c" after applying context')
  base2.a.set('its my own')
  t.equal(base.a.__c, null, 'no context on "a" after resolve')
  val = c.applyContext(stored)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  t.equal(b.__c, base2.a, 'context on "b" after applying context')
  t.equal(c.__c, base2.a, 'context on "c" after applying context')
  t.equal(base2.a.__c, null, 'no context on "base2.a" after applying context')

  const base3 = new base.Constructor({ key: 'base3' })
  a = base3.a
  b = base3.a.b
  c = base3.a.b.c
  stored = base3.a.b.c.storeContext()
  base3.a.b.set('its my own')
  val = c.applyContext(stored)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  t.equal(b.__c, null, 'no context on "b" after applying context')
  t.equal(c.__c, base3.a.b, 'context on "c" after applying context')
  t.equal(base3.a.__c, null, 'no context on "base3.a" after applying context')

  const base4 = new base.Constructor({ key: 'base4' })
  a = base4.a
  stored = base4.a.storeContext()
  base4.a.set('its my own')
  val = a.applyContext(stored)
  t.ok(a !== base4.a, 'created new instance for base4.a')
  t.equal(val, base4.a, 'applyContext returns new base')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')

  const base5 = new base.Constructor({ key: 'base5' })
  a = base5.a
  b = base5.a.b
  stored = base5.a.b.storeContext()
  base5.a.remove()
  val = c.applyContext(stored)
  t.equal(val, null, 'applyContext returns null on removal')
  // b is now disconnected from base5
  t.equal(b.__c, null, 'no context on "b" after applying context')
  // add one more test thing it self if removed!
  t.end()
})

// // double test
// test('context - apply and resolve (double)', function (t) {
//   const b = new Base({
//     val: 'b',
//     key: 'B',
//     nestB: 'nestB',
//     noReference: true,
//     define: { inspect () { return '' } }
//   })
//   const c = new Base({ key: 'c', cA: { cB: new b.Constructor() } })
//   const d = new c.Constructor({ key: 'd' })
//   const base = d.cA.cB.nestB
//   const store = base.storeContext()
//   b.nestB.set('testVal')
//   // this is still ok

//   c.cA.cB.nestB.set('testVal2')
//   // this is really difficult cA.Cb <--
//   // spec it

//   var stored = base.applyContext(store)
//   t.equal(stored, void 0, 'returns void 0')
//   console.log(store)
//   // should we return base -- when its a base then you know its pretty wrong
//   // return BASE when it no longer correct

//   // ok so lets get the context back and return the new base
//   // so what we can do is check for this and do something about it
//   t.end()
// })

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
