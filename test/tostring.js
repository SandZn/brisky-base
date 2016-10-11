'use strict'
const test = require('tape')
const Base = require('../')

test('toString - inspect', t => {
  const a = Base('hello')
  t.equal(a.inspect(), 'Base "hello"')
  const b = Base({
    properties: { type: null },
    val: 'hello',
    type: {}
  })
  t.equal(b.inspect(), 'CustomBase {\n  "type": {},\n  "val": "hello"\n}')
  b.key = 'b'
  t.equal(b.inspect(), 'B b {\n  "type": {},\n  "val": "hello"\n}')
  t.end()
})
