'use strict'
/**
 * @function each: iterates over keys
 * @memberOf Base
 */
exports.define = {
  each (fn, attach, type) {
    const keys = this.keys(type)
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let ret = fn(this[key], key, this, attach)
      if (ret) {
        return ret
      }
      if (keys.length !== len) {
        // pretty slow but creates correct results
        if (keys.length < len) {
          i--
        }
        len = keys.length
      }
    }
  }
}
