'use strict'
const test = require('tape')
const base = require('../../..')

test('property - child - complex', t => {
  const a = base({
    types: {
      a: {
        properties: {
          syncUp (val) {
            this.set({
              child: {
                child: 'Constructor'
              }
            }, false)
            this.syncUp = this.child.prototype.syncUp = val
          },
          syncDown (val) {
            this.set({
              child: {
                child: 'Constructor'
              }
            }, false)
            this.syncDown = this.child.prototype.syncDown = val
          },
          sync (val) {
            return this.set({
              syncUp: val,
              syncDown: val
            }, false)
          }
        },
        child: 'Constructor'
      }
    },
    child: { type: 'a' }
  })

  a.set({
    a: {
      b: {
        sync: false,
        c: {
          d: true
        }
      }
    },
    x: {
      sync: true,
      y: {
        sync: false,
        z: {}
      }
    }
  })

  t.equal(a.x.y.z.syncUp, false, 'nested inherits from first common child construct')
  t.equal(a.x.syncUp, true, 'does not replace higher up')
  t.end()
})

test('property - child - complex - properties deep', function (t) {
  const otherState = {
    child: {
      child: 'Constructor',
      properties: {
        current: { lulz: true } // this results in a max call stack
      }
    }
  }
  const obj = base({
    inject: otherState,
    x: {
      y: {
        z: { current: true }
      }
    }
  })
  t.equal(obj.x.y.z.current.lulz.compute(), true, 'correct current property')
  t.end()
})
