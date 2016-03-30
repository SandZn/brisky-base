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

// const parseref = require('../../parseref')
//const reference = /^\$(\/|\.\/)/
/*
  if (
    typeof val === 'string' &&
    reference.test(val)
  ) {
    val = parseref(this, val)
  } else if (val && typeof val === 'object') {
    if (
      val instanceof Array && (val[0] === '$' || val[0] === '$.') ||
      val.val && val.val instanceof Array
    ) {
      if (val.val) {
        let newVal = {}
        // faster way to copy
        for (let key in val) {
          newVal[key] = val[key]
        }
        newVal.val = parseref(this, val.val)
        val = newVal
      } else {
        val = parseref(this, val)
      }
    }
  }
*/