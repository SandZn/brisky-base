'use strict'
const test = require('tape')
const base = require('../')

test('path', t => {
  t.plan(6)
  const obj = base({ a: { b: { c: true } } })
  t.same(obj.a.b.c.path(), ['a', 'b', 'c'], 'path')
  t.same(obj.a.b.c.realPath(), ['a', 'b', 'c'], 'realPath')
  t.same(obj.a.b.c.realPath(obj.a), ['b', 'c'], 'realPath with limit')
  const mempath = obj.a.b.c.realPath(false, true)
  t.same(mempath, ['a', 'b', 'c'], 'realPath with memoization')
  t.equal(obj.a.b.c._memoizedPath, mempath, 'correct ._memoizedPath')
  t.equal(obj.a.b.c.realPath(false, true), mempath, 'returns same memoized path')
})

test('context-path', t => {
  t.plan(2)
  const obj = base({ a: { b: { c: true } } })
  const instance = new obj.Constructor({ key: 'instance' })
  t.same(instance.a.b.c.path(), ['instance', 'a', 'b', 'c'], 'context-path')
  t.same(obj.a.b.c.path(), ['a', 'b', 'c'], 'normal')
})

test('multiple-context-path', t => {
  const obj = base({ a: { b: { c: true } } })
  const c = base({
    key: 'c-i',
    x: {
      y: {
        z: new obj.Constructor({ noReference: true })
      }
    }
  })
  const d = new c.Constructor({ key: 'd-i' })
  t.equal('_z' in d.x.y, true, 'resolved context for d.x.y.z')
  t.same(d.x.y.z.a.b.c.path(), ['d-i', 'x', 'y', 'z', 'a', 'b', 'c'], 'correct double context path')
  const e = base({ key: 'its e' })
  const refToContext = d.x.y.z.a.b.c
  d.x.y.__c = e // set incorrect context
  refToContext._parent._parent.__c = e // set more incorrect context
  t.same(refToContext.path(), ['d-i', 'x', 'y', 'z', 'a', 'b', 'c'], 'repairs incorrect context')
  t.end()
})
