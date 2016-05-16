'use strict'
/**
 * @function each: iterates in an array or object passed as context(this)
 * @memberOf Base
 * default excludes fields starting with "_",
 * fields that are nulled and fields in ._properties["field"]
 * @param  {function} fn
 *  the function in which will be executed for every item
 *  or value/key in the array/object
 * @param {function} excludes
 *  a function or string (only allowed for objects) to be ignored when iterating
 *  overrirdes default fields in ._properties["field"] exclusion
 * @param {*} attach - variable to passon to exclude and fn
 * @returns {*} returns value returned by functions
 */
exports.define = {
  each (fn, filter, attach) {
    var val
    if (filter) {
      val = eachFiltered(this, fn, filter, attach)
    } else {
      val = eachDefault(this, fn, attach)
    }
    return val
  }
}

function eachDefault (target, fn, attach) {
  const keys = target.keys()
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let ret = fn(target[key], key, target, attach)
    if (ret) {
      return ret
    }
  }
}

function eachFiltered (target, fn, filter, attach) {
  for (let i in target) {
    let iteratee = target[i]
    let val = i[0] !== '_' && iteratee !== null &&
      filter(iteratee, i, target, attach) &&
      fn(iteratee, i, target, attach)
    if (val) {
      return val
    }
  }
}
