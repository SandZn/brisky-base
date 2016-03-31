'use strict'
// const Base = require('../../')

/**
 * @function addNewProperty
 * @memberOf Base#
 * @param {String} key Key to be set on new property
 * @param {*} val The value that will be set on val
 * @param {Event} [event] Current event
 * @param {property} [base] Property to be set
 * @return {Base} this
 */
exports.addNewProperty = function (key, val, property, stamp) {
  val = new this.Child(val, stamp, this, key)
  this[key] = val
  this.clearKeys(val)
  if (this._Constructor) {
    // this can create some weird behaviours -- ignore those for now
    // the while loop here is obviously lame as fuck
    this.createContextGetter(key)
  }
}

// /**
//  * @function checkUseVal
//  * checks the useVal of a property
//  * useVal will override default behaviour and use the value directly as property
//  * @memberOf Base#
//  * @return {*} returns useval property
//  */
// function checkUseVal (useVal, val, event, parent, key) {
//   val = useVal === true ? val : useVal
//   // use _base_version (consistent)
//   if (val instanceof Base) {
//     if (!val.hasOwnProperty('_parent') || val._parent === parent || !val._parent) {
//       val.key = key
//       val._parent = parent
//       return val
//     }
//   } else {
//     if (useVal === true) {
//       return
//     }
//     return val
//   }
// }
