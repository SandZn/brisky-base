'use strict'
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

  if (isObj(val) && val.HELLO) {
    console.log('HEREHEREHERE', 'xxxx', val)
  }

  var resolve = !nocontext && base.__c
  if (isObj(val)) {
    if (resolve) {
      base = base.resolveContext(val, stamp)
    } else {
      let changed
      for (let key in val) {
        if (base.setKey(key, val[key], stamp, resolve, nocontext)) {
          changed = true
        }
      }
      if (!changed) { return }
    }
  } else {
    base = base.setValue(val, stamp, resolve)
  }
  return base
}
