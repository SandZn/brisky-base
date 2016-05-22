'use strict'
const Base = require('../../../')
const isObj = require('vigour-util/is/obj')
const isEmpty = require('vigour-util/is/empty')
const isNumber = require('vigour-util/is/number')
const parse = require('./parse')
const map = require('./map')

/**
 * @namespace Properties
 * @class
 * Constructor for property definitions
 */
const Properties = function () {}
const propertiesProto = Properties.prototype
const types = require('./types')

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {stamp} stamp stamp passed on from current set
 */
propertiesProto.properties = function (val, stamp, resolve, nocontext) {
  let type = val && typeof val
  if (
    type && type === 'object' &&
    val.isBase ||
    type === 'function'
  ) {
    if (val.isBase) {
      val = val.Constructor
    }
    this.set({ Child: val }, stamp)
    return
  } else if (!isObj(val)) {
    throw new Error('.properties need to be set with an object')
  }
  let properties = this._properties
  if (properties._propertiesBind !== this) {
    let DerivedProperties = function () {}
    DerivedProperties.prototype = properties
    this._properties = properties = new DerivedProperties()
    properties._propertiesBind = this
  }
  for (let key in val) {
    let property = parse(val[key])
    this.propertyTypes(properties, property, key, val, stamp, nocontext)
  }
  map(this)
}

/**
 * @property _propertiesBind
 * _propertiesBind means the current vObj properties are bound to
 * @memberOf Properties#
 */
propertiesProto._propertiesBind = Base

/**
 * @property propertyTypes
 * defines different types of possible property definitions
 * @memberOf Base#
 */
exports.propertyTypes = function (properties, property, key, val, stamp, nocontext) {
  var prototype = property && property.prototype
  if (prototype && typeof prototype === 'object' && prototype.isBase) {
    clearProperty.call(this, key, stamp, properties)
    properties[key] = types.createPropertyConstructor(property, key)
  } else {
    let type = typeof property
    if (property === null) {
      clearProperty.call(this, key, stamp, properties)
    } else if (type === 'function') {
      properties[key] = property
    } else if (type === 'string' || isNumber(property)) {
      properties._overrides = properties._overrides || {}
      properties._overrides[key] = property
      properties[key] = types.createPrimitiveProperty(property)
    } else if (property === true) {
      properties[key] = types.default
    } else if (isObj(property)) {
      types.custom.call(this, properties, property, key, stamp)
    } else {
      propertyTypeError(property, key)
    }
  }
}

function clearProperty (key, stamp, properties) {
  var target = key
  const overrides = properties._overrides
  if (overrides && overrides[key]) {
    target = overrides[key]
    delete overrides[key]
    if (isEmpty(overrides)) {
      delete properties._overrides
    }
  }
  if (this[target]) {
    if (this[target].remove) {
      this[target].remove(stamp)
    }
    Object.defineProperty(this, target, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    })
  }
  if (target === 'val') {
    // exception since val null means "removed", may need to remove this behaviour
    delete this[target]
  } else {
    this[target] = null // vs inheritance
  }
  this.clearKeys()
  properties[key] = null
}

function propertyTypeError (property, key) {
  // make a custom error -- property error -- test it
  throw new Error('base.properties - uncaught property type ' + key + ': "' + property + '"')
}

/**
 * @property _properties
 * Location of Properties objects on base
 * @memberOf Base#
 */
exports._properties = {
  value: new Properties(),
  writable: true
}

/**
 * @property properties
 * getter and setter to modify _properties
 * calls _properties.properties when set
 * @memberOf Base#
 */
exports.properties = {
  get () {
    return this._properties
  },
  set (val) {
    this._properties.properties.call(this, val)
  }
}
