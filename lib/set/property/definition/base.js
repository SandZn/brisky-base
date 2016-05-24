'use strict'
/**
 * @function baseProperty
 * helper for Constructors as properties
 * @memberOf Properties#
 * @param {function} Constructor the constructor to be wrapped
 * @param {string} key - key of the property
 * @param {string} [override] - override the normal key
 * @todo share the propertyConstructor function
 */
module.exports = function baseProperty (base, key) {
  var Constructor
  base.noReference = true
  if (!base.key) { base.key = key }
  function baseProperty (val, stamp, resolve, nocontext) {
    const property = this[key]
    if (!property) {
      if (!Constructor) {
        // is this better? may be dangerous
        Constructor = base.Constructor
      }
      val = new Constructor(val, stamp, this, key)
    }
    return this.setKeyInternal(key, val, stamp, nocontext, property)
  }
  baseProperty.base = base
  return baseProperty
}
