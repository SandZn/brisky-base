'use strict'
const isMapped = require('./keymap').isMapped

module.exports = function moveKey (target, key, val, props, stamp, prop, move) {
  if (isMapped(props, key)) {
    // dont move when reset: false
    const current = props.keyMap[key]
    const instance = target[current]
    if (instance !== null && instance !== void 0) {
      if (target[current].isBase) {
        props[key].base.key = move
        instance.noReference = true
        target.set({
          [move]: instance
        }, stamp)
        instance.noReference = null
        target[current] = null
      } else {
        target[move] = instance
        target[current] = null
      }
    }
  }
}
