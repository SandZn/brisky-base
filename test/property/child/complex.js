'use strict'
const test = require('tape')
const base = require('../../..')

test('property - child - complex', t => {
  const a = base({
    properties: {
      syncUpIsFn: true,
      syncDownIsFn: true,
      syncUp (val) {
        if (!this.hasOwnProperty('child')) {
          this.set({ child: { child: 'Constructor' } }, false)
        }
        this.child.prototype.syncUp = this.syncUp = val
      },
      syncDown (val) {
        if (!this.hasOwnProperty('child')) {
          this.set({ child: { child: 'Constructor' } }, false)
        }
        this.child.prototype.syncDown = this.syncDown = val
      },
      sync (val) {
        return this.set({
          syncUp: val,
          syncDown: val
        }, false)
      }
    }
  })

  console.log(a)
})
