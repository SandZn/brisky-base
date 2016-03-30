'use strict'
var Base = require('../../../')
var isObj = require('vigour-util/is/obj')
var isNumber = require('vigour-util/is/number')
var parse = require('./parse')
/**
 * @namespace Properties
 * @class
 * Constructor for property definitions
 */
var Properties = function () {}
var propertiesProto = Properties.prototype
var types = require('./types')
Properties.default = types.default
Properties.createPrimitiveProperty = types.createPrimitiveProperty
Properties.createPropertyConstructor = types.createPropertyConstructor

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {stamp} stamp stamp passed on from current set
 */
propertiesProto.properties = function (val, stamp, resolve, nocontext) {
  if (val && typeof val === 'object' && val._base_version || typeof val === 'function') {
    this.set({ Child: val }, stamp) // pretty smooth
    return
  } else if (!isObj(val)) {
    throw new Error('properties need to be set with a plain object')
  }
  let properties = this._properties

  // think this can improbve greatly
  if (properties._propertiesBind !== this) {
    let DerivedProperties = function () {}
    // maybe use object.create here
    DerivedProperties.prototype = properties
    this._properties = properties = new DerivedProperties()
    properties._propertiesBind = this
  }
  for (let key in val) {
    let property = parse(val[key])
    this.propertyTypes(properties, property, key, val, stamp, nocontext)
  }
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
  if (prototype && typeof prototype === 'object' && prototype._base_version) {
    clearProperty.call(this, key, stamp)
    properties[key] = types.createPropertyConstructor(property, key)
  } else {
    let type = typeof property
    if (property === null) {
      clearProperty.call(this, key)
      this[key] = null
      properties[key] = null
    } else if (type === 'function') {
      properties[key] = property
    } else if (type === 'string' || isNumber(property)) {
      properties[key] = types.createPrimitiveProperty(property)
    } else if (property === true) {
      properties[key] = types.default
    } else if (isObj(property)) {
      types.custom.call(this, properties, property, key, stamp)
    } else {
      propertyTypeError(property)
    }

    // make this cleaner and add it to a seperate file
    // make it more generic as well
    // use the info friom tghe other stuff
    // fix fix fix
    // do the hash

    // if (!this._pstr) {
      // this._pstr = 'properties'
    // }
    // this._pstr += '|' + key
    // this._re = new RegExp('^(.+:)?' + (this._pstr) + '$')

    /*
    if (
        key === 'define' ||
        key === 'properties' ||
        key === 'inject' ||
        key === 'type' ||
        key === 'val'
      ) {
        return key
      }
    */
    // can be possible to hash the keys and have a default function when you dont add anythign from start?
    // saves speed on all un-altered important thigns like state / obs / base
    var checks = ''
    // nice indentation makes it run faster...
    for (var prop in this.properties) {
      if (this.properties[prop] && prop !== '_propertiesBind') {
        checks += '\n  key === \'' + prop + '\' ||'
      }
    }
    checks = checks.slice(0, -2)
    var str = 'if(' + checks + '\n) { return key }'
    this._mapProperty = Function('key', str) //eslint-disable-line
    console.log('add --> prop:', key)
  }
}

function clearProperty (key, stamp) {
  if (this[key]) {
    if (this[key].remove) {
      this[key].remove(stamp)
    }
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    })
    this[key] = null
  }
}

function propertyTypeError (property, key) {
  // make a custom error -- property error
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
