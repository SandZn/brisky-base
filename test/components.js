'use strict'
var test = require('tape')
var Base = require('../')

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
  var b = new TemplateB({ type: 'this is special' })
  t.equals(
    b.type.val,
    'this is special',
    'b.type has a correct input value'
  )
  t.equals(b.type.type, 'special', 'b.type has type "special"')
})
