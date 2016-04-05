'use strict'
const test = require('tape')
const Base = require('../')

test('context override (noContext property)', function (t) {
  t.plan(2)
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
})

test('context keys', function (t) {
  t.plan(3)
  const a = new Base({ a: true })
  t.equal(a._a, void 0, 'no context key before creation of constructor')
  const A = a.Constructor
  t.equal(a._a, a.a, 'has context key after creation of constructor')
  const b = new A({ b: true })
  t.equal(b._b, void 0, 'no context key before creation of inhertied constructor')
})

test('context resolvement', function (t) {
  t.plan(3)
  const base = new Base({ a: { b: 'b' } })
  const instance = new base.Constructor()
  instance.a.b.set('hello')
  t.equal(instance._a._b !== base._a._b, true, 'resolved context')
  const instance2 = new base.Constructor()
  instance2.a.b.remove()
  t.equal(instance2._a._b, null, 'removed b from instance2')
  t.equal(instance2._a !== base._a, true, 'resolved context for a')
})

test('nested context resolvement for override properties', function (t) {
  t.plan(6)
  const On = new Base().Constructor
  const base = new Base({
    properties: {
      on: { val: On, override: '_on' }
    },
    on: {},
    normal: {}
  })
  const a = new base.Constructor({
    on: { data: 'hello' },
    normal: { data: 'normal-hello' }
  })
  t.equal('data' in a._on, true, 'has _on.data')
  t.equal('data' in a.normal, true, 'has normal.data')
  t.equal('_data' in a._on, false, 'does not have _on._data')
  t.equal('_data' in a.normal, false, 'does not have normal._data')
  a.Constructor
  t.equal('_data' in a._on, true, 'has _on._data after constructor creation')
  t.equal('_data' in a.normal, true, 'has normal._data after constructor creation')
})
