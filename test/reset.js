'use strict'
const test = require('tape')
const base = require('../')

test('reset', t => {
  t.plan(3)
  const obj = base({
    a: { b: { c: true } },
    properties: {
      bla: true
    },
    bla: 'bla'
  })

  t.
})
