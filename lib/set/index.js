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
 * @param  {escape} [boolean] escape reserved fields
 * @return {Base|undefined} if undefined no change happened
 */
exports.set = function (val, stamp, nocontext) {
  var base = this
  var resolveContext = !nocontext && base._c
  if (isObj(val)) {
    if (resolveContext) {
      base = base.resolveContext(val, stamp)
    }

     // else {
    //   let changed
    // // this is a lil dirt for element -- will make this into real functions
    //   if (val.components) {
    //     if (base.setKey('components', val.components, event, nocontext, escape)) {
    //       changed = true
    //     }
    //   }

    //   if (val.inject) {
    //     if (base.setKey('inject', val.inject, event, nocontext, escape)) {
    //       changed = true
    //     }
    //   }

    //   for (let key in val) {
    //     if (base.__input === null) {
    //       break
    //     }
    //     if (key === 'inject' || key === 'components') {

    //     } else if (key === 'val') {
    //       if (base.setValue(val[key], event, resolveContext)) {
    //         changed = true
    //       }
    //     } else {
    //       if (base.setKey(key, val[key], event, nocontext, escape)) {
    //         changed = true
    //       }
    //     }
    //   }
    //   if (!changed) {
    //     return
      // }
    // }
  } else {
    base = base.setValue(val, stamp, resolveContext)
  }
  return base
}
