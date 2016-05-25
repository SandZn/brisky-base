'use strict'
const removeFromKeyMap = require('./keymap').remove

module.exports = function clearProperty (target, key, props, stamp, mappedKey) {
  const instance = target[key]
  removeFromKeyMap(props, mappedKey)
  if (instance) {
    if (instance.remove) {
      instance.remove(stamp)
    }
    target.clearKeys()
  }
  if (key === 'val') {
    delete target[key]
  } else {
    target[key] = null
  }
}
