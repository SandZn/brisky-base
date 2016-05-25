'use strict'
const isEmpty = require('vigour-util/is/empty')

module.exports = function clearProperty (target, key, props, stamp, mappedKey) {
  const keyMap = props.keyMap
  const propTarget = target[key]
  if (keyMap && keyMap[mappedKey]) {
    delete keyMap[mappedKey]
    if (isEmpty(keyMap)) {
      delete props.keyMap
    }
  }
  if (propTarget) {
    if (propTarget.remove) {
      propTarget.remove(stamp)
    }
    target.clearKeys()
  }
  if (key === 'val') {
    // exception since val null means "removed"
    delete target[key]
  } else {
    // prevents inheritance
    target[key] = null
  }
}
