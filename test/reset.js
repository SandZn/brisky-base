'use strict'
const test = require('tape')
const base = require('../')

test('reset', t => {
  const obj = base({
    a: { b: { c: true } },
    properties: {
      bla: true
    },
    bla: 'bla'
  })

  obj.reset()
  t.equal(obj.bla, 'bla', 'keeps properties')
  t.equal(obj.a, null, 'removes properties that end up in keys')
  t.end()
})
