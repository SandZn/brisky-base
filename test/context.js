'use strict'
var test = require('tape')
var Base = require('../')

test('context override', function (t) {
  t.plan(2)
  var Template = new Base({
    key: 'template',
    noContextField: { noContext: true }
  }).Constructor
  var aTemplate = new Template({ key: 'aTemplate' })
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
