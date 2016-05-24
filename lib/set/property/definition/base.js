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
module.exports = function baseProperty (Constructor, key, override) {
  const proto = Constructor.prototype
  proto.noReference = true
  if (!proto.key) { proto.key = key }
  function baseProperty (val, stamp, resolve, nocontext, type) {
    if (override) { type = key }
    if (val && val.noReference && (!val._parent || val._parent === this)) {
      val._key = key
      val._parent = this
      this.addNewProperty(type, val, void 0, stamp)
      return val
    } else {
      const property = this[type]
      if (!property) {
        let instance = new Constructor(void 0, stamp, this, type)
        this.addNewProperty(type, instance, void 0, stamp)
        this[type].set(val, stamp) // add resolve etc
        return this[type]
      }
      return this.setKeyInternal(type, val, stamp, nocontext, property)
    }
  }
  baseProperty.base = proto
  return baseProperty
}
