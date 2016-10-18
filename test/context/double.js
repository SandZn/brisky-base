'use strict'
const test = require('tape')
const base = require('../../')

test('context - double - override (noContext property)', t => {
  const b = base({
    val: 'b',
    key: 'B',
    nestB: 'nestB',
    noReference: true
  })
  const c = base({ cA: { cB: new b.Constructor() } })
  const d = new c.Constructor()
  t.same(d.cA.cB.nestB.path(), [ 'cA', 'cB', 'nestB' ], 'double context has correct path')
  d.cA.cB.nestB.set('resolve d!')
  t.equal(d.cA.cB.nestB === b.nestB, false, 'resolved double context')
  const e = new c.Constructor()
  e.set({ cA: { cB: { nestB: 'resolve e!' } } })
  t.equal(e.cA.cB.nestB === b.nestB, false, 'resolved double context using deep set')
  const f = new c.Constructor()
  f.cA.cB.set({ nestB: null })
  t.equal(f.cA.cB.nestB === b.nestB, false, 'resolved double context using remove')
  t.equal(f.cA.cB.nestB, null, 'removed nestB')
  t.same(f.cA.cB.keys(), [], 'remove results in empty keys')
  const g = new c.Constructor()
  g.cA.cB.nestB.set('nestB')
  t.equal(g.cA.cB.nestB === g.nestB, false, 'does resolve if its the same (creates its own)')
  t.end()
})
