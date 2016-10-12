'use strict'
const test = require('tape')
const Base = require('../../../base')

test('property - child', t => {
  const base = new Base({ y: true })
  base.set({
    y: {
      properties: {
        x: 'hello'
      },
      child: 'Constructor'
    }
  })
  base.set({
    y: {
      bla: {
        x: {}
      }
    }
  })
  t.equal(base.y.bla.x.val, 'hello', 'child property inherits')
  t.end()
})

test('property - child - enhance property definition', t => {
  const base = new Base({ y: true })
  base.set({
    properties: {
      content: {
        child: {
          properties: {
            hello: { val: true }
          },
          child: 'Constructor'
        }
      }
    },
    content: {
      what: {
        hello: {},
        other: {
          hello: {}
        }
      }
    }
  })

  t.ok(
    base.content.what.hello instanceof
    base.properties.content
      .base.child.prototype
      .properties.hello.base.Constructor,
    'correct child over properties'
  )

  base.set({
    properties: {
      content: {
        child: {
          properties: {
            hello: { val: 'haha' }
          },
          child: 'Constructor'
        }
      }
    }
  })

  t.equal(
    base.content.what.hello.val,
    'haha',
    'child property inherits'
  )

  t.equal(
    base.content.what.other.hello.val,
    'haha',
    'child property inherits'
  )

  t.end()
})

test('child', t => {
  const bchild = new Base('bye')
  function Special (val) {
    this.internalStuff = val
  }
  const a = new Base({
    child: { val: 'hello' },
    b: { child: bchild },
    c: { child: Special }
  })
  t.same(a.b.serialize(), 'hello', 'object notation')
  a.b.set({ c: {} })
  t.same(a.b.c.serialize(), 'bye', 'base notation')
  a.c.set({ special: 'hello' })
  t.same(a.c.special instanceof Special, true, 'custom constructor')
  a.set({ child: { field: true } })
  t.same(a.b.field.serialize(), true, 'b - use set when child is allready defined')
  t.same(a.c.field.serialize(), true, 'c - use set when child is allready defined')
  t.end()
})

test('child - merge', t => {
  const a = new Base({
    child: { child: 'Constructor' },
    inject: [
      {
        child: {
          a: true
        }
      },
      {
        child: {
          b: true
        }
      }
    ]
  })
  a.set({ x: true })
  t.same(a.x.a.keys(), [ 'a', 'b' ], 'merged correctly')
  t.end()
})

test('child - recursive optimization', t => {
  const moduleA = {
    child: {
      child: 'Constructor',
      a: true
    }
  }

  const moduleB = {
    child: {
      b: true,
      child: 'Constructor'
    }
  }

  const moduleC = {
    child: {
      c: true,
      child: 'Constructor'
    }
  }

  const a = new Base({
    types: {
      a: { type: 'base', child: 'Constructor' }
    },
    child: { type: 'a' },
    bla: {
      bla: true
    },
    inject: [ moduleA, moduleB, moduleC ]
  })

  a.set({ x: { y: { z: true } } })

  const child = a.child

  t.equal(child.prototype.child, child, 'a.child.child equals a.child')
  t.equal(a.x.a.child.prototype.child, child, 'a.child.child equals a.child')
  t.equal(a.x.b.child.prototype.child, child, 'a.child.child equals a.child')
  t.equal(a.x.c.child.prototype.child, child, 'a.child.child equals a.child')
  t.equal(a.x.c.child.prototype.child, child, 'a.child.child equals a.child')

  a.set({
    types: {
      a: {
        hello: true,
        child: 'Constructor'
      }
    }
  })

  a.set({
    types: {
      a: {
        bye: true,
        child: 'Constructor'
      }
    }
  })

  t.equal(a.x.y.z.bye.compute(), true, 'injecting on a type adds to everything')
  t.equal(a.x.y.z.hello.compute(), true, 'injecting on a type adds to everything')

  t.end()
})
