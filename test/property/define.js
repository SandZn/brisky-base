'use strict'
const test = require('tape')
const base = require('../../')

test('property - define - default', t => {
  const obj = base({
    properties: {
      define: {
        x: { key: 'y', val: true }
      }
    }
  })
  obj.set({ x: 0 })
  t.equal(obj.y, 0, 'default type')
  t.same(obj.properties.keyMap, { x: 'y' }, 'has correct key map')
  obj.set({
    properties: {
      define: {
        x: { key: 'z' }
      }
    }
  })
  t.equal(obj.z === 0 && obj.y === null, true, 'moved property y → z')
  t.same(obj.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  obj.set({
    properties: {
      define: {
        x: { key: null }
      }
    }
  })
  t.equal(obj.x === 0 && obj.z === null, true, 'moved property z → x')
  obj.set({ x: 'hello' })
  t.equal(obj.x, 'hello', 'redefined property x → x')
  obj.set({
    properties: {
      define: {
        x: {
          val (val) {
            this.specialX = val
          },
          reset: false
        }
      }
    }
  })
  t.equal(obj.x, 'hello', 'no reset')
  t.end()
})

test('property - define - base', t => {
  const obj = base({
    properties: {
      define: {
        x: { key: 'y', val: 0 }
      }
    }
  })
  obj.set({ x: 0 })
  t.equal(obj.y && obj.y.val, 0, 'base type')
  t.same(obj.properties.keyMap, { x: 'y' }, 'has correct key map')
  obj.getConstructor()
  obj.set({
    properties: {
      define: { x: { key: 'z' } }
    },
    x: 'its z!',
    other: {}
  })
  t.equal(obj.z && obj.z.val === 'its z!' && obj.y === null, true, 'moved property y → z')
  t.equal(obj.properties.x.base.key, 'z', 'property got correct key')
  t.same(obj.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  t.same(obj.keys(), [ 'z', 'other' ], 'correct keys after move')
  obj.set({
    properties: {
      define: {
        x: {
          key: null,
          val: { field: 'hello' }
        }
      }
    }
  })
  t.equal(obj.x && obj.x.isBase && obj.z === null, true, 'moved property z → x')
  t.same(obj.keys(), [ 'other', 'x' ], 'correct keys after move')
  t.equal(obj.x && obj.x.field.val, 'hello', 'set property x')
  t.equal(obj.properties.keyMap, null, 'remove property map')
  obj.set({
    properties: {
      define: {
        g: {
          key: 'dawg',
          val: true
        }
      }
    }
  })
  t.same(obj.properties.keyMap, { g: 'dawg' }, 're-added property map')
  obj.set({
    g: 'do it',
    properties: {
      define: {
        g: {
          key: 'blurg',
          reset: false
        }
      }
    }
  })
  t.equal(obj.dawg, 'do it', 'did not move keys with reset false')
  obj.set({ g: 'hello' })
  t.equal(obj.blurg, 'hello', 'did add key to blurg')
  const instance = new obj.Constructor({
    properties: {
      define: {
        x: {
          key: 'y'
        }
      }
    }
  })
  t.equal(instance.y && instance.y.val, 'its z!', 'moved property x → y on instance')
  t.equal(obj.x && obj.x.isBase && !obj.y, true, 'did not influence base')
  instance.set({
    properties: {
      define: {
        x: {
          val: { bla: true },
          reset: true
        }
      }
    }
  })
  t.equal(!instance.properties.x.base.val, true, 'reset - no set')
  t.equal(instance.x, null, 'cleared x')
  instance.set({
    properties: {
      define: {
        x: {
          val: { hello: true },
          key: null,
          reset: false
        }
      }
    }
  })
  t.equal(!instance.x && instance.y && !instance.hello, true, 'did not move y')
  t.same(instance.properties.keyMap, { g: 'blurg' }, 'removed x from property map')
  instance.set({ x: 'yo' })
  t.equal(instance.x && instance.x.hello.val, true, 'set on x')
  t.end()
})
