'use strict'
const isMapped = require('./keymap').isMapped

// here we can use "move"
module.exports = function moveKey (target, key, props, stamp, prop, move, reset) {
  if (prop && reset !== false) {
    const current = isMapped(props, key) ? props.keyMap[key] : key
    if (current !== move) {
      if ('base' in props[key]) {
        props[key].base.key = move
      }
      target.move(current, move, stamp)
    }
  }
}
