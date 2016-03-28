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
* @property Child
* Default Constructor used for children of base object
*/
exports.Child = Base

/**
* @function generateConstructor
* Generates a constructor function
* @return {function}
*/
exports.generateConstructor = function () {
  return function derivedBase () {
    this._Constructor = null
    this.clearContext()
    Base.apply(this, arguments)
  }
}

/**
* @property Constructor
* Creates a constructor when called
* Adds context getters for each field
* @return {function}
*/
exports.Constructor = {
  set (val) {
    this._Constructor = val
  },
  get () {
    if (!this._Constructor) {
      for (let key in this) {
        this.createContextGetter(key)
      }
      let Constructor = this._Constructor = this.generateConstructor()
      Constructor.prototype = this
    }
    return this._Constructor
  }
}
