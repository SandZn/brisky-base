'use strict'
const test = require('tape')
const Base = require('../../')

test('keys - inheritance', function (t) {
  const BaseExample = new Base({
    something: true,
    hello: '?',
    child: 'Constructor'
  }).Constructor
  const a = new BaseExample({
    b: {
      c: {
        something: { hello: {} }
      }
    }
  })
  t.same(a.something.keys(), [], 'a keys are empty')
  t.same(a.b.something.keys(), [], 'a.b keys are empty')
  t.same(a.b.c.something.keys(), [ 'hello' ], 'a.b.c keys equal [ "hello" ]')
  const base = new Base({
    d: true
  })
  const instance = new base.Constructor({
    x: true, y: true, z: true, special: null
  })
  t.same(
    instance.keys(),
    [ 'd', 'x', 'y', 'z' ],
    'merge keys for instance'
  )
  base.set({ special: true, e: true, y: true })
  t.same(
    instance.keys(),
    [ 'd', 'x', 'y', 'z', 'e' ],
    'add "e", do not add "special" (nulled)'
  )
  base.d.remove()
  base.y.remove()
  t.same(
    instance.keys(),
    [ 'x', 'y', 'z', 'e' ],
    'removed "d", do not remove "y"'
  )
  const instance2 = new instance.Constructor({ b: true })
  t.same(
    instance2.keys(),
    [ 'x', 'y', 'z', 'e', 'b' ],
    'instance2 has correct keys'
  )
  base.set({ h: true })
  t.same(
    instance2.keys(),
    [ 'x', 'y', 'z', 'e', 'b', 'h' ],
    'after updating base instance2 has correct keys'
  )
  const b = new Base({ a: true })
  const c = new b.Constructor({ a: null })
  t.same(
    c.keys(),
    [],
    'c keys are empty (1 field removal)'
  )
  t.end()
})

test('keys - inheritance - remove all keys', function (t) {
  const a = new Base({
    a: true
  })
  const b = new a.Constructor({
    reset: true
  })
  t.equal(b.keys().length, 0, 'reset on new instance removes all keys')
  t.end()
})
