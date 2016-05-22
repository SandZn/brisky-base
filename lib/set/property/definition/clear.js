'use strict'
const isEmpty = require('vigour-util/is/empty')

module.exports = function clearProperty (target, key, stamp, properties) {
  var keyTarget = key
  const overrides = properties._overrides
  if (overrides && overrides[key]) {
    keyTarget = overrides[key]
    delete overrides[key]
    if (isEmpty(overrides)) {
      delete properties._overrides
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
  properties[key] = null
}
