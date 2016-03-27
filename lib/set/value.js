'use strict'

/**
 * @function setValueInternal
 * @memberOf Base#
 * @param  {*} val The value that will be set on __input
 * @param {Event} [event] Current event
 * @return {Base} this
 */
exports.setValueInternal = function (val, event) {
  this.__input = val
  return this
}

/**
 * @function setValue
 * @memberOf Base#
 * @param {*} val The value that will be set on __input
 * @param {Event} [event] Current event
 * @param {resolveContext} [boolean] tells if context has to be resolved
 * @return {Base|undefined} if undefined no change happened
 */
exports.setValue = function (val, event, resolveContext) {
  if (val === this.__input) {
    // no change dont do anything
    return
  }
  if (val === null) {
    let r = this.remove(event)
    return r || this
  } else if (resolveContext) {
    return this.resolveContext(val, event)
  } else {
    return this.setValueInternal(val, event)
  }
}
