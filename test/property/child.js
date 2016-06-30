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
          hello: true,
          child: 'Constructor'
        }
      }
    },
    content: {
      what: true
    }
  })

  t.equal(
    base.content.what.hello,
    base.properties.content.base.child.prototype.hello,
    'correct child over properties'
  )

  base.set({
    properties: {
      content: {
        child: {
          hello: 'haha',
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

  t.end()
})
