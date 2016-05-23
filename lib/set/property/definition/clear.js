'use strict'
const isEmpty = require('vigour-util/is/empty')

// rename _overrides ?
module.exports = function clearProperty (target, key, props, stamp) {
  var keyTarget = key
  const overrides = props._overrides
  if (overrides && overrides[key]) {
    keyTarget = overrides[key]
    delete overrides[key]
    if (isEmpty(overrides)) {
      delete props._overrides
    }
  }
  if (target[keyTarget]) {
    if (target[keyTarget].remove) {
      target[keyTarget].remove(stamp)
    }
    Object.defineProperty(target, keyTarget, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    })
  }
  if (keyTarget === 'val') {
    // exception since val null means "removed", may need to remove this behaviour
    delete target[keyTarget]
  } else {
    target[keyTarget] = null // vs inheritance
  }
  target.clearKeys()
  props[key] = null
}
