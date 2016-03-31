'use strict'
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
    // this can create some weird behaviours -- ignore those for now -- dont want the while loop
    this.createContextGetter(key)
  }
}
