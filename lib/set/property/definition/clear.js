'use strict'
const removeFromKeyMap = require('./keymap').remove

module.exports = function clearProperty (target, key, props, stamp, realKey) {
  const instance = target[key]
  removeFromKeyMap(props, realKey)
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
