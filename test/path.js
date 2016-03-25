'use strict'
const test = require('tape')
const Base = require('../')
// const perf = require('vigour-performance').run

test('path', function (t) {
  t.plan(3)
  var base = new Base({ a: { b: { c: true } } })
  t.deepEqual(base.a.b.c.path(), ['a', 'b', 'c'], 'path')
  t.deepEqual(base.a.b.c.realPath(), ['a', 'b', 'c'], 'realPath')
  t.deepEqual(base.a.b.c.realPath(base.a), ['b', 'c'], 'realPath with limit')
})

test('parentLevel', function (t) {
  t.plan(1)
  var base = new Base({ a: { b: { c: true } } })
  t.deepEqual(base.a.b.c.parentLevel(), ['a', 'b', 'c'], 'path')
})
