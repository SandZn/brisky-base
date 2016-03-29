'use strict'
// const isPlainObj = require('vigour-util/is/plainobj')
const isObj = require('vigour-util/is/obj')

/**
 * @function set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [event]
 *   when false events are not executed
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
exports.set = function (val, stamp, nocontext) {
  var base = this
  var resolveContext = !nocontext && base._c
  if (isObj(val)) {
    if (resolveContext) {
      base = base.resolveContext(val, stamp)
    } else {
      let changed
      for (let key in val) {
        if (base.setKey(key, val[key], stamp, nocontext)) {
          changed = true
        }
      }
      if (!changed) {
        return
      }
    }
  } else {
    base = base.setValue(val, stamp, resolveContext)
  }
  return base
}

// add val property
