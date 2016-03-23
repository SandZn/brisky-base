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
  var a = new Base({ a: true })
  t.equal(a._a, void 0, 'no context key before creation of constructor')
  var A = a.Constructor
  t.equal(a._a, a.a, 'has context key after creation of constructor')
  var b = new A({ b: true })
  t.equal(b._b, void 0, 'no context key before creation of inhertied constructor')
})
