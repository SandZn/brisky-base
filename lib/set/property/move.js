'use strict'

exports.move = function (current, move, stamp) {
  console.log('move ', current, '->', move)
  let instance = this[current]
  if (instance !== null && instance !== void 0) {
    if (this[current].isBase) {
      // props[key].base.key = move
      this.removeKey(current)
      this[current] = null
      instance._parent = null
      instance.noReference = true
      this.set({ [move]: instance }, stamp, true)
    } else {
      this[move] = instance
      this.removeKey(current)
      this[current] = null
    }
  }
}
