'use strict'
/**
 * @function baseProperty
 * helper for base properties
 * @memberOf Properties#
 * @param {function} base the base to be wrapped
 * @param {string} key - key of the property
 */
module.exports = function baseProperty (base, key) {
  var Constructor
  base.noReference = true
  function baseProperty (val, stamp, resolve, nocontext) {
    const property = key in this && this[key]
    if (!property) {
      if (!Constructor) {
        Constructor = base.Constructor
      }
      val = new Constructor(val, stamp, this, key)
    }
    return this.setKeyInternal(key, val, stamp, nocontext, property)
  }
  baseProperty.base = base
  return baseProperty
}
