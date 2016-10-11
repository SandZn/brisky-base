'use strict'
const test = require('tape')
const Base = require('../')

test('path', function (t) {
  t.plan(6)
  const base = Base({ a: { b: { c: true } } })
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
  const base = Base({ a: { b: { c: true } } })
  const instance = Base.Constructor({ key: 'instance' })
  t.same(instance.a.b.c.path(), ['instance', 'a', 'b', 'c'], 'context-path')
  t.same(base.a.b.c.path(), ['a', 'b', 'c'], 'normal')
})

test('multiple-context-path', function (t) {
  const base = Base({ a: { b: { c: true } } })
  const c = Base({
    key: 'c-i',
    x: {
      y: {
        z: Base.Constructor({
          noReference: true
        })
      }
    }
  })
  const d = new c.Constructor({
    key: 'd-i'
  })
  t.equal('_z' in d.x.y, true, 'resolved context for d.x.y.z')
  t.same(d.x.y.z.a.b.c.path(), ['d-i', 'x', 'y', 'z', 'a', 'b', 'c'], 'correct double context path')
  const e = Base({ key: 'its e' })
  const refToContext = d.x.y.z.a.b.c
  d.x.y.__c = e // set incorrect context
  refToContext._parent._parent.__c = e // set more incorrect context
  t.same(refToContext.path(), ['d-i', 'x', 'y', 'z', 'a', 'b', 'c'], 'repairs incorrect context')
  t.end()
})
