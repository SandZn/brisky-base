'use strict'
/**
 * @function defaultProperty
 * helper for normal sets (property is set immediately on key)
 * @memberOf Properties#
 */
module.exports = function defaultProperty (val, stamp, resolve, nocontext, key) {
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}
