'use strict'
const isEmpty = require('vigour-util/is/empty')

// rename _overrides ? _mapKeys
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
    // may need to do an instanceof check here
    if (target[keyTarget].remove) {
      target[keyTarget].remove(stamp)
    }
    // why this? seems bit intense....
    // target[keyTarget] = void 0 -- seems better
    Object.defineProperty(target, keyTarget, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    })
    target.clearKeys()
  }
  if (keyTarget === 'val') {
    // exception since val null means "removed", may need to remove this behaviour
    delete target[keyTarget]
  } else {
    target[keyTarget] = null // vs inheritance
  }
  props[key] = null
}
