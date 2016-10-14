'use strict'
const test = require('tape')
const base = require('../../../')

test('property - child', t => {
  const elem = base({
    types: {
      ul: {
        tag: 'ul',
        child: {
          tag: 'li',
          type: 'ul' // this -- ultra powerful
          // would need like this new parent.Constructor()
        }
      }
    }
  })

  elem.set({
    list: { type: 'ul' }
  })

  console.log(elem)

  t.end()
})
