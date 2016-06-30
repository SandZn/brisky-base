'use strict'
const test = require('tape')
const Base = require('../../')

test('property - child', function (t) {
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

test('property - child - enahnce property definition', function (t) {
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
