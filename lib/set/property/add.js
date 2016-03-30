'use strict'
const Base = require('../../')

/**
 * @function addNewProperty
 * @memberOf Base#
 * @param {String} key Key to be set on new property
 * @param {*} val The value that will be set on val
 * @param {Event} [event] Current event
 * @param {property} [base] Property to be set
 * @todo requires perf optmizations
 * @return {Base} this
 */
exports.addNewProperty = function (key, val, property, stamp) {
  // make args allways follow the same patterns so stamp after val
  val = this.getPropertyValue(val, stamp, this, key)
  // var prop = new this.Child(val, stamp, this, key)
  this[key] = val
  this.clearKeys(val)
  var parent = this
  // this is more then bad -- really really has to be removed cant loop for every new prop!
  // its pure insanity -- not the cullprit though
  while (parent) {
    if (parent._Constructor) {
      // this guy needs some optmization as well -- not important atm
      this.createContextGetter(key)
      parent = null
    } else {
      parent = parent._parent
    }
  }
}

/**
 * @function checkUseVal
 * checks the useVal of a property
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {*} returns useval property
 */
function checkUseVal (useVal, val, event, parent, key) {
  val = useVal === true ? val : useVal
  // use _base_version (consistent)
  if (val instanceof Base) {
    if (!val.hasOwnProperty('_parent') || val._parent === parent || !val._parent) {
      val.key = key
      val._parent = parent
      return val
    }
  } else {
    if (useVal === true) {
      return
    }
    return val
  }
}

/**
 * @function getPropertyValue
 * checks if property thats being set has a useVal or UseConstructor
 * else creates a new instance of Child
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {Base} returns new instance of property Constructor
 */
exports.getPropertyValue = function (val, event, parent, key) {
  if (val) {
    let useVal = (val.useVal)
    if (useVal) {
      let prop = checkUseVal(useVal, val, event, parent, key)
      if (prop) {
        return prop
      }
    }
  }
  return parent.Child
    ? new parent.Child(val, event, parent, key)
    : val
}
