'use strict'
const test = require('tape')
const Base = require('../../')

test('property - define - default', function (t) {
  const base = new Base({
    properties: {
      define: {
        x: { key: 'y', val: true }
      }
    }
  })
  base.set({ x: 0 })
  t.equal(base.y, 0, 'default type')
  t.same(base.properties.keyMap, { x: 'y' }, 'has correct key map')
  base.set({
    properties: {
      define: {
        x: { key: 'z' }
      }
    }
  })
  t.equal(base.z === 0 && base.y === null, true, 'moved property y → z')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  base.set({
    properties: {
      define: {
        x: { key: null }
      }
    }
  })
  t.equal(base.x === 0 && base.z === null, true, 'moved property z → x')
  base.set({ x: 'hello' })
  t.equal(base.x, 'hello', 'redefined property x → x')

  base.set({
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
  t.equal(base.x, 'hello', 'no reset')
  t.end()
})

test('property - define - base', function (t) {
  const base = new Base({
    properties: {
      define: {
        x: { key: 'y', val: 0 }
      }
    }
  })
  base.set({ x: 0 })
  t.equal(base.y && base.y.val, 0, 'base type')
  t.same(base.properties.keyMap, { x: 'y' }, 'has correct key map')
  base.getConstructor()
  base.set({
    properties: {
      define: { x: { key: 'z' } }
    },
    x: 'its z!',
    other: {}
  })
  t.equal(base.z && base.z.val === 'its z!' && base.y === null, true, 'moved property y → z')
  t.equal(base.properties.x.base.key, 'z', 'property got correct key')
  t.same(base.properties.keyMap, { x: 'z' }, 'has correct key map after move')
  base.set({
    properties: {
      define: {
        x: {
          key: null,
          val: { field: 'hello' }
        }
      }
    }
  })
  t.equal(base.x && base.x.isBase && base.z === null, true, 'moved property z → x')
  t.equal(base.x && base.x.field.val, 'hello', 'set property x')
  t.equal(base.properties.keyMap, null, 'remove property map')
  base.set({
    properties: {
      define: {
        g: {
          key: 'dawg',
          val: true
        }
      }
    }
  })
  t.same(base.properties.keyMap, { g: 'dawg' }, 're-added property map')
  base.set({
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
  t.equal(base.dawg, 'do it', 'did not move keys with reset false')
  base.set({ g: 'hello' })
  t.equal(base.blurg, 'hello', 'did add key to blurg')
  const instance = new base.Constructor({
    properties: {
      define: {
        x: {
          key: 'y'
        }
      }
    }
  })
  t.equal(instance.y && instance.y.val, 'its z!', 'moved property x → y on instance')
  t.equal(base.x && base.x.isBase && !base.y, true, 'did not influence base')
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
