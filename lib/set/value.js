'use strict'

/**
 * @function setValueInternal
 * @memberOf Base#
 * @param  {*} val The value that will be set on val
 * @param {Stamp} [stamp] Current stamp
 * @return {Base} this
 */
exports.setValueInternal = function (val, stamp) {
  this.val = val
  return this
}

/**
 * @function setValue
 * @memberOf Base#
 * @param {*} val The value that will be set on val
 * @param {Stamp} [stamp] Current stamp
 * @param {resolveContext} [boolean] tells if context has to be resolved
 * @return {Base|undefined} if undefined no change happened
 */
exports.setValue = function (val, stamp, resolveContext) {
  if (val === this.val) {
    return
  }
  if (val === null) {
    let r = this.remove(stamp)
    return r || this
  } else if (resolveContext) {
    return this.resolveContext(val, stamp)
  } else {
    return this.setValueInternal(val, stamp)
  }
}
