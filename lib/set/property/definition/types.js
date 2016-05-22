'use strict'
const parse = require('./parse')
const clear = require('./clear')

/**
 * @function Properties.default
 * helper for normal sets (property is set immediately on key)
 * @memberOf Properties#
 * @return {Base|undefined} when undefined no change happened
 */
exports.default = function (val, stamp, resolve, nocontext, key) {
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}

/**
 * @function Properties.primitive
 * helper for sets, property is set on different key
 * @param {string} field set property on field
 * @memberOf Properties#
 */
exports.primitive = function (field) {
  return function (val, stamp, resolve, nocontext, key) {
    return exports.default.call(this, val, stamp, resolve, nocontext, field)
  }
}

/**
 * @function Properties.base
 * helper for Constructors as properties
 * @memberOf Properties#
 * @param {function} Constructor the constructor to be wrapped
 * @param {string} key - key of the property
 * @param {string} [override] - override the normal key
 * @todo share the propertyConstructor function
 */
exports.base = function (Constructor, key, override) {
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
  // same as Object.getPrototypeOf may need to just use that
  baseProperty.base = proto
  return baseProperty
}

exports.custom = function (target, properties, property, key, stamp) {
  if (
    key in properties &&
    properties[key] &&
    properties[key].base
  ) {
    if (!(
      'override' in property ||
      'type' in property ||
      'reset' in property
    )) {
      properties[key].base.set(property)
    } else {
      if ('reset' in property) {
        delete property.reset
      }
      clear(target, key, stamp, properties)
      customProperty(target, properties, property, key, stamp)
    }
  } else {
    customProperty(target, properties, property, key, stamp)
  }
}

// the .val notation is really ambigious -- fix this
function customProperty (target, properties, property, key, stamp) {
  const override = property.override
  var val = property.val
  if (val || override) {
    let proto
    if (val) {
      val = parse(property.val)
      proto = val.prototype
    }
    if (proto && typeof proto === 'object' && proto.isBase) {
      if (override) {
        properties._overrides = properties._overrides || {}
        properties._overrides[key] = override
        properties[key] = exports.base(val, override, true)
        properties[key].override = override
        properties[override] = properties[key]
      } else {
        properties[key] = exports.base(val, key)
        target[key] = proto
        proto._parent = target
      }
    } else {
      if (!override && Object.keys(property).length > 1) {
        baseDefault(target, property, stamp, key, properties)
      } else {
        if (override) {
          properties[key] = exports.primitive(override)
        } else {
          properties[key] = exports.default
        }
        if (val !== void 0) {
          properties[key].call(target, val, void 0, void 0, void 0, key)
        }
      }
    }
  } else if (key !== '_overrides') {
    baseDefault(target, property, stamp, key, properties)
  }
}

function baseDefault (target, property, stamp, key, properties) {
  if (property.type) {
    let res = target.getType(property, stamp, key, void 0)
    if (res && res.isBase) {
      properties[key] = exports.base(
        new res.Constructor(property, false, target, key).Constructor,
        key
      )
    }
  } else {
    properties[key] = exports.base(
      new target.Child(property, false, target, key).Constructor,
      key
    )
  }
}
