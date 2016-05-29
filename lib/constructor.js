'use strict'
var Base = require('./')

/**
* @function setParent
* Adds base to a parent, sets key on base
* @param  {*} val set value of the base object
* @param  {Event} [stamp] pass stamp, on base base constructor defaults to false
* @param  {base} [parent] parent object
* @param  {string} [key] key thats being set on a parent
* @return {base}
*/
exports.setParent = function (val, stamp, parent, key) {
  if (parent) {
    this._parent = parent
  } else if (this._parent) {
    this._parent = null
  }
  if (key !== void 0) {
    this.key = key
  }
  return this
}

/**
* @property child
* Default Constructor used for children of base object
*/
exports.child = Base

/**
* @function generateConstructor
* Generates a Constructor function
* @return {function}
*/
exports.generateConstructor = function () {
  return function derivedBase (val, stamp, parent, key) {
    this.clearContext()
    Base.call(this, val, stamp, parent, key)
  }
}

/**
* @property Constructor
* Creates a constructor when called
* Adds context getters for each field
* @return {function}
*/
exports.getConstructor = function () {
  if (!this._Constructor) {
    const keys = this._keys
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        this.createContextGetter(keys[i])
      }
    }
    const Constructor = this._Constructor = this.generateConstructor()
    Constructor.prototype = this
  }
  return this._Constructor
}

// getters are extremely slow!
exports.Constructor = {
  set (val) {
    this._Constructor = val
  },
  get () {
    return this.getConstructor()
  }
}
