'use strict'
const test = require('tape')
const Base = require('../')

test('path', function (t) {
  t.plan(6)
  const base = new Base({ a: { b: { c: true } } })
  t.same(base.a.b.c.path(), ['a', 'b', 'c'], 'path')
  t.same(base.a.b.c.realPath(), ['a', 'b', 'c'], 'realPath')
  t.same(base.a.b.c.realPath(base.a), ['b', 'c'], 'realPath with limit')
  const mempath = base.a.b.c.realPath(false, true)
  t.same(mempath, ['a', 'b', 'c'], 'realPath with memoization')
  t.equal(base.a.b.c._memoizedPath, mempath, 'correct ._memoizedPath')
  t.equal(base.a.b.c.realPath(false, true), mempath, 'returns same memoized path')
})

test('context-path', function (t) {
  t.plan(2)
  const base = new Base({ a: { b: { c: true } } })
  const instance = new base.Constructor({ key: 'instance' })
  t.same(instance.a.b.c.path(), ['instance', 'a', 'b', 'c'], 'context-path')
  t.same(base.a.b.c.path(), ['a', 'b', 'c'], 'normal')
})

test('context-path', function (t) {
  t.plan(2)
  const base = new Base({ a: { b: { c: true } } })
  const instance = new base.Constructor({ key: 'instance' })
  t.same(instance.a.b.c.path(), ['instance', 'a', 'b', 'c'], 'context-path')
  t.same(base.a.b.c.path(), ['a', 'b', 'c'], 'normal')
})
