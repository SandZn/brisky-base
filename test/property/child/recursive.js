'use strict'
const test = require('tape')
const base = require('../../../')

test('property - child', t => {
  const elem = base({
    types: {
      // ul: {
      //   tag: 'ul',
      //   child: {
      //     type: 'ul'
      //   }
      // },
      lulz: {
        tag: 'lulz',
        field: {
          type: 'lulz'
        }
      }
    }
  })

  // console.log('set')
  // elem.set({ list: { type: 'ul' } })
  // console.log('set is done')
  // console.log(elem)

  // elem.set({
  //   list: {
  //     field: {
  //       flups: true
  //     }
  //   }
  // })
  // console.log(elem)

  elem.set({
    lulz: {
      type: 'lulz',
      field: {
        // field: { reset: true, val: 'xxxx' },
        flups: 'glurrrf'
      }
    }
  })

  console.log(elem.lulz.field.flups)

  console.log(elem.types.lulz.field === elem.lulz.field)

  t.end()
})
