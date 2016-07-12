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
  c.applyContext(stored)
  t.equal(a.__c, base2, 'context on "a" after applying context')
  t.equal(b.__c, base2, 'context on "b" after applying context')
  t.equal(c.__c, base2, 'context on "c" after applying context')
  base2.a.set('its my own')
  t.equal(base.a.__c, null, 'no context on "a" after resolve')
  var stored2 = c.applyContext(stored)
  t.equal(stored, stored2, 'returns stored')
  t.equal(stored2[1], 2, 'reduced context level in stored')
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
  stored2 = c.applyContext(stored)
  t.equal(stored2[1], 1, 'reduced context level in stored')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  t.equal(b.__c, null, 'no context on "b" after applying context')
  t.equal(c.__c, base3.a.b, 'context on "c" after applying context')
  t.equal(base3.a.__c, null, 'no context on "base3.a" after applying context')
  const base4 = new base.Constructor({ key: 'base3' })
  a = base4.a
  stored = base4.a.storeContext()
  base4.a.set('its my own')
  stored2 = a.applyContext(stored)
  t.equal(stored2, void 0, 'stored is empty')
  t.equal(a.__c, null, 'no context on "a" after applying context after resolve')
  // add remove case
  const base5 = new base.Constructor({ key: 'base3' })
  a = base5.a
  b = base5.a.b
  stored = base5.a.b.storeContext()
  base5.a.remove()
  stored2 = c.applyContext(stored)
  t.equal(stored2, void 0, 'reduced context level in stored')
  t.equal(b.__c, null, 'no context on "b" after applying context')
  t.end()
})

// double test
// test('storeContext and applyContent', function (t) {
//   const b = new Base({
//     val: 'b',
//     key: 'B',
//     nestB: 'nestB',
//     noReference: true
//   })
//   const c = new Base({ cA: { cB: new b.Constructor() } })
//   const d = new c.Constructor()
//   const base = d.cA.cB.nestB
//   const store = base.storeContext()
//   b.nestB.set('testVal')
//   c.cA.cB.nestB.set('testVal2')
//   base.applyContext(store)
//   base.set('A!')
//   t.equal(d.cA.cB.nestB.val, 'A!', 'applied context')
//   base.applyContext(store)
//   base.set('B!')
//   t.equal(d.cA.cB.nestB.compute(), 'B!', 'applied context again')
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
