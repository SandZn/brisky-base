'use strict'
/**
 * @function defaultProperty
 * helper for normal sets (property is set immediately on key)
 * @memberOf Properties#
 */
function defaultProperty (val, stamp, resolve, nocontext, key) {
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}

defaultProperty.map = function mapDefaultProperty (key, mapKey) {
  return !mapKey
    ? defaultProperty
    : function mapProperty (val, stamp, resolve, nocontext) {
      if (this[key] !== val) {
        this[key] = val
        return this
      }
    }
}

module.exports = defaultProperty
