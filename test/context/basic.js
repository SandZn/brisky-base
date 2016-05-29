'use strict'
const test = require('tape')
const Base = require('../../')

test('context - override (noContext property)', function (t) {
  const Template = new Base({
    key: 'template',
    noContextField: { noContext: true }
  }).Constructor
  const aTemplate = new Template({ key: 'aTemplate' })
  t.equal(
    aTemplate.noContextField.path()[0],
    'template',
    'noContextField path is not in context'
  )
  aTemplate.noContextField.set('hello')
  t.equal(
    Template.prototype.noContextField.compute(),
    'hello',
    'setting noContextField does not create a new instance'
  )
  t.end()
})

test('context - parent', function (t) {
  const base = new Base({
    a: {
      b: {
        c: {
          d: 'd'
        }
      }
    }
  })
  const instance = new base.Constructor({
    a: {
      b: 'my own!'
    }
  })
  t.equal(instance.a.b.c.d.cParent(), base.a.b.c, 'normal parent')
  t.equal(instance.a.b.c.cParent(), instance.a.b, 'context')
  const a = instance.a
  const b = instance.a.b
  a.__c = base
  t.equal(b.cParent(), a, 'repairs illegal context')
  t.end()
})

test('context - keys', function (t) {
  const a = new Base({ a: true })
  t.equal(a._a, void 0, 'no context key before creation of constructor')
  const A = a.Constructor
  t.equal(a._a, a.a, 'has context key after creation of constructor')
  const b = new A({ b: true })
  t.equal(b._b, void 0, 'no context key before creation of inhertied constructor')
  t.end()
})

test('context - resolvement', function (t) {
  const base = new Base({ a: { b: 'b' } })
  const instance = new base.Constructor()
  instance.a.b.set('hello')
  t.equal(instance._a._b !== base._a._b, true, 'resolved context')
  const instance2 = new base.Constructor()
  instance2.a.b.remove()
  t.equal(instance2._a._b, null, 'removed b from instance2')
  t.equal(instance2._a !== base._a, true, 'resolved context for a')
  t.end()
})

test('WRONG - REFACTOR AFTER PROPS! - context - nested resolvement for override properties', function (t) {
  const On = new Base().Constructor
  const ref = new Base()
  const base = new Base({
    properties: {
      on: { val: On, override: '_on' }
    },
    on: {},
    normal: ref
  })
  const a = new base.Constructor({
    on: { data: 'hello' },
    normal: { data: 'normal-hello' }
  })

  // wrong test need to check in __on

  t.equal('data' in a._on, true, 'has _on.data')
  t.equal('data' in a.normal, true, 'has normal.data')
  t.equal('_data' in a._on, false, 'does not have _on._data')
  t.equal('_data' in a.normal, false, 'does not have normal._data')
  t.equal(ref.__c, void 0, 'ref should not get context')
  a.Constructor
  t.equal('_data' in a._on, true, 'has _on._data after constructor creation')
  t.equal('_data' in a.normal, true, 'has normal._data after constructor creation')
  t.end()
})
