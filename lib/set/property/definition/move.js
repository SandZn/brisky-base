'use strict'
const isMapped = require('./keymap').isMapped

module.exports = function moveKey (target, key, props, stamp, prop, move) {
  if (isMapped(props, key)) {
    const current = props.keyMap[key]
    const instance = target[current]
    if (instance !== null && instance !== void 0) {
      if (target[current].isBase) {
        props[key].base.key = move
        target[current] = null
        instance._parent = null
        instance.noReference = true
        target.set({ [move]: instance }, stamp, true)
      } else {
        target[move] = instance
        target[current] = null
      }
    }
  }
}
