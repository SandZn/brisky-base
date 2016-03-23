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
