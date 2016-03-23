'use strict'
var test = require('tape')
var isEmpty = require('vigour-util/is/empty')
var _isEqual = require('lodash.isequal')
var Base = require('../')

test('keys', function (t) {
  var base = new Base({
    a: true,
    b: true,
    val: 'something'
  })
  t.plan(6)
  t.equal(base.keys().length, 2, 'correct length')
  base.removeProperty(base.a, 'a')
  t.equal(base.keys().length, 1, 'correct length after removal')
  base.setKey('c', true)
  t.equal(base.keys().length, 2, 'correct length after setKey')
  base.clear()
  t.equal(isEmpty(base), true, 'isEmpty === true after clear')
  t.equal(base.keys(), false, 'keys are false after clear')
  base.set({ d: true })
  t.equal(base.keys().length, 1, 'correct length after set')
})

test('make references by using [ "$", "field" ] notation', function (t) {
  var base = new Base({
    field: 'something',
    other: [ '$', 'field' ]
  })
  t.plan(4)
  t.equal(base.other.val, base.field, 'other equals field')
  var base2 = new Base({
    field: { a: [ '$', 'field', 'b' ] }
  })
  t.equal(base2.field.a.val, base2.field.b, 'field.a created a reference to field.b')
  base.set('other', '$/field')
  t.equal(base2.field.a.val, base2.field.b, '"$/field" notation works')
  base.set({
    field: {
      c: 'c',
      a: { b: '$./../c' }
    }
  })
  t.equal(base.field.a.b.val, base.field.c, '"$./../c" notation works')
})

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

test('type override', function (t) {
  t.plan(4)
  var Template = new Base({
    type: 'template'
  }).Constructor
  var TemplateA = new Template({
    properties: { type: null },
    Child: {
      type: 'something',
      field: 'a field'
    },
    type: 'this is something'
  }).Constructor
  var a = new TemplateA()
  t.equals(
    a.type.type,
    'something',
    'a.type is an instance of Child with type something'
  )
  t.equals(a.type.val, 'this is something', 'a.type has a correct input value')
  var TemplateB = new Template({
    properties: {
      type: new Base({ type: 'special' })
    }
  }).Constructor
  var b = new TemplateB({
    type: 'this is special'
  })
  t.equals(
    b.type.val,
    'this is special',
    'b.type has a correct input value'
  )
  t.equals(b.type.type, 'special', 'b.type has type "special"')
})

var cases = [
  { a: true, b: { c: 'yo' } }
]

test('serialize', function (t) {
  t.plan(cases.length)
  cases.forEach(function (item) {
    var base = new Base(item)
    t.equals(_isEqual(base.serialize(), item), true)
  })
})
