'use strict'
/**
 * @property rootOverride
 * @memberOf Base#
 * @param {*} boolean
 * Limits cached path and getRoot() to the rootOveride
 */
exports.rootOverride = true

/**
 * @property noReference
 * @memberOf Base#
 * @param {*} val
 * Overwrites default set handler when a value does not have a parent
 * it will use the value immedialty
 * usefull for things like dom-elements
 * setting to true returns the current instance of Base
 */
exports.noReference = true

/**
 * @property noContext
 * @memberOf Base#
 * @param {*} boolean
 * Block automatic creation of contexts getters and instances
 */
exports.noContext = true

/**
 * @property Constructor
 * @memberOf Base#
 * Overwrites Constructor
 * @param {*} val
 */
exports.Constructor = true

/**
 * @property key
 * @memberOf Base#
 * @param {String} val - Sets key
 */
exports.key = true

/**
 * @property bind
 * @memberOf Base#
 * @param {*} val - bind this value on emitter, and .compute
 */
exports.bind = true

/**
 * @property define
 * @memberOf Base#
 * @param {object} val
 * @todo add util.isArray (faster then instanceof)
 * convenience wrapper for define
*/
exports.define = function (val) {
  if (val instanceof Array) {
    this.define.apply(this, val)
  } else {
    this.define(val)
  }
}

/**
 * @property inject
 * @memberOf Base#
 * @param {object} val
 * convenience wrapper for inject
*/
exports.inject = function (val, stamp) {
  if (val instanceof Array) {
    if (stamp !== void 0) {
      val = val.concat([stamp])
    }
    this.inject.apply(this, val)
  } else {
    this.inject(val, stamp)
  }
}

/**
 * @property origin
 * @memberOf Base#
 * @param {*} val - do a set on the origin
 */
exports.origin = function (val, stamp) {
  this.origin().set(val, stamp)
}

// /**
//  * @property set
//  * @memberOf Base#
//  * @param {*} function - add a lowlevel hook to the set method, gaurds for change
//  */
exports.set = function (fn) {
  var _set = this.set
  this.define({
    set (val, stamp) {
      let base = _set.apply(this, arguments)
      if (base) {
        fn.call(base, val, stamp)
      }
      return base
    }
  })
}

exports.val = function (val, stamp, resolve, nocontext) {
  // need to pass changed of course
  return this.setValue(val, stamp, resolve)
}

/**
 * @property property
 * @memberOf Base#
 * @param {function} val - maps keys to properties
 */
exports.property = function (val) {
  const mp = this.property
  this.define({
    property () {
      var result = mp.apply(this, arguments)
      if (!result) { result = val.apply(this, arguments) }
      return result
    }
  })
}

/**
 * @property reset
 * @memberOf Base#
 * @param {*} boolean
 * Resets a base (clears all properties)
 */
exports.reset = function (val) {
  if (val === true) {
    return this.reset()
  }
}
