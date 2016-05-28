'use strict'

exports.move = function (current, move, stamp) {
  let instance = this[current]
  if (instance !== null && instance !== void 0) {
    if (this[current].isBase) {
      this.removeKey(current)
      this[current] = null
      instance._parent = null
      let reset
      if (!instance.noReference) {
        reset = instance.hasOwnProperty('noReference')
        instance.noReference = true
      }
      this.set({ [move]: instance }, stamp, true)
      if (reset !== void 0) {
        if (reset) {
          instance.noReference = null
        } else {
          delete instance.noReference
        }
      }
    } else {
      this[move] = instance
      this.removeKey(current)
      this[current] = null
    }
  }
}
