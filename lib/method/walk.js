'use strict'

/**
 * @function walk: walks over all properties
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
  walk (fn, filter, attach, tree) {
    var val
    if (filter) {
      val = walkFiltered(this, fn, filter, attach, tree)
    } else {
      val = walkDefault(this, fn, attach, tree)
    }
    return val
  }
}

function walkDefault (target, fn, attach, tree) {
  // support iteration when it needs to create the keys
  var keys = target.keys()
  for (var i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    if (tree) {
      tree = (attach[key] = {})
    }
    let val = walkDefault(target[key], fn, tree, tree) || fn(target[key], key, target, attach)
    if (val) {
      return val
    }
  }
}

function walkFiltered (target, fn, filter, attach, tree) {
  for (let i in target) {
    let iteratee = target[i]
    let val = i[0] !== '_' && iteratee !== null &&
      filter(iteratee, i, target, attach) &&
      (tree && (tree = (attach[i] = {}))) &&
      (walkDefault(target[i], fn, tree, tree) || fn(iteratee, i, target, attach))
    if (val) {
      return val
    }
  }
}
