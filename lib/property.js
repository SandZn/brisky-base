'use strict'
var Base = require('./')
var isPlainObj = require('vigour-util/is/plainobj')
var isNumber = require('vigour-util/is/number')

/**
 * @namespace Properties
 * @class
 * Constructor for property definitions
 */
var Properties = function () {}
var propertiesProto = Properties.prototype

/**
 * @function Properties.default
 * helper for normal sets (property is set immediately on key)
 * @memberOf Properties#
 * @return {Base|undefined} when undefined no change happened
 */
Properties.default = function (val, stamp, nocontext, key) {
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}

/**
 * @function Properties.createPrimitiveProperty
 * helper for sets, property is set on different key
 * @param {string} field set property on field
 * @memberOf Properties#
 */
Properties.createPrimitiveProperty = function (field) {
  return function (val, stamp, nocontext, key) {
    return Properties.default.call(this, val, stamp, nocontext, field)
  }
}

/**
 * @function Properties.createPropertyConstructor
 * helper for Constructors as properties
 * @memberOf Properties#
 * @param {function} Constructor the constructor to be wrapped
 * @param {string} key - key of the property
 * @param {string} [override] - override the normal key
 * @todo share the propertyConstructor function
 */

Properties.createPropertyConstructor = function (Constructor, key, override) {
  var proto = Constructor.prototype
  proto._useVal = true
  if (!proto.key) {
    proto.key = key
  }

  function propertyConstructor (val, stamp, nocontext, type, escape) {
    // this, val, stamp, nocontext, type, escape
    if (override) {
      type = key
    }

    // or override
    var property = this[type]
    // way more efficient then set key internal apparantly?
    if (!property) {
      // is this the magic trick?
      let instance = new Constructor(void 0, stamp, this, type)
      this.addNewProperty(
        type,
        instance,
        void 0,
        stamp
      )
      this[type].set(val, stamp)
      return this[type]
    }
    return this.setKeyInternal(type, val, property, stamp, nocontext)
  }
  // same as getPrototypeOf
  propertyConstructor.base = proto
  return propertyConstructor
}

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {stamp} stamp stamp passed on from current set
 */
propertiesProto.properties = function (val, stamp, nocontext) {
  if (val instanceof Base || typeof val === 'function') {
    this.set({ Child: val }, stamp) // pretty smooth
    return
  } else if (!isPlainObj(val)) {
    throw new Error('properties need to be set with a plain object')
  }
  let properties = this._properties
  if (properties.binds !== this) {
    let DerivedProperties = function () {}
    // maybe use object.create here
    DerivedProperties.prototype = properties
    this._properties = properties = new DerivedProperties()
    properties.binds = this
  }
  for (let key in val) {
    let property = parseProperty(val[key])
    this.propertyTypes(properties, property, key, val, stamp, nocontext)
  }
}

/**
 * @property binds
 * binds means the current vObj properties are bound to
 * @memberOf Properties#
 */
propertiesProto.binds = Base

/**
 * @property propertyTypes
 * defines different types of possible property definitions
 * @memberOf Base#
 */
exports.propertyTypes = function (properties, property, key, val, stamp, nocontext) {
  var prototype = property && property.prototype
  if (prototype && prototype instanceof Base || prototype === Base.prototype) {
    clearProperty.call(this, key, stamp)
    properties[key] = Properties.createPropertyConstructor(property, key)
  } else {
    let type = typeof property
    if (property === null) {
      clearProperty.call(this, key)
      this[key] = null
      properties[key] = null
    } else if (type === 'function') {
      properties[key] = property
    } else if (type === 'string' || isNumber(property)) {
      properties[key] = Properties.createPrimitiveProperty(property)
    } else if (property === true) {
      properties[key] = Properties.default
    } else if (isPlainObj(property)) {
      custom.call(this, properties, property, key, stamp)
    } else {
      propertyTypeError(property)
    }

    if (!this._) {
      this._ = {}
    } else if (!this.hasOwnProperty('_')) {
      let tcache = {}
      for (var i in this._) { tcache[i] = true }
      this._ = tcache
    }
    this._[key] = true

    // removing properties

    console.log('PROP:', key)
  }
}

function clearProperty (key, stamp) {
  if (this[key]) {
    if (this[key].remove) {
      this[key].remove(stamp)
    }
    // add this in define -- remove all
    Object.defineProperty(this, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    })
    this[key] = null
  }
}

function parseProperty (property) {
  if (property instanceof Base) {
    if (property.hasOwnProperty('_Constructor') || property === Base.prototype) {
      property = new property.Constructor().Constructor
    } else {
      property = property.Constructor
    }
  } else if (typeof property === 'function' && property.prototype) {
    if (property.prototype.hasOwnProperty('_Constructor') || property === Base) {
      property = new property().Constructor // eslint-disable-line
    }
  }
  return property
}

// make an easy option to use childconstrucor for val
function custom (properties, property, key, stamp) {
  if (property === null) {
    properties[key] = null
  } else if (property.val) {
    property.val = parseProperty(property.val)
    var prototype = property.val.prototype
    if (prototype && prototype instanceof Base) {
      if (property.override) {
        properties._overrides = properties._overrides || {}
        properties._overrides[key] = property.override
        properties[key] = Properties
          .createPropertyConstructor(property.val, property.override, true)
        properties[key].override = property.override
        properties[property.override] = properties[key]
      } else {
        this[key] = properties[key] = prototype
        prototype._parent = this
      }
    } else {
      if (property.override) {
        properties[key] = Properties.createPrimitiveProperty(property.override)
      } else {
        properties[key] = Properties.default
      }
      properties[key].call(this, property.val, void 0, void 0, key)
    }
  } else if (key !== '_overrides') {
    if (property.type) {
      let res = this.getType(property, stamp, key, void 0)
      if (res instanceof Base) {
        properties[key] = Properties
        .createPropertyConstructor(new res.Constructor(property, false, this, key).Constructor, key)
        return
      }
    }
    properties[key] = Properties
      .createPropertyConstructor(new this.Child(property, false, this, key).Constructor, key)
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
