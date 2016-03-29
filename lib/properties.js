'use strict'
/**
 * @property rootOverride
 * @memberOf Base#
 * @param {*} boolean
 * Limits cached path and getRoot() to the rootOveride
 */
exports.rootOverride = true

/**
 * @property useVal
 * @memberOf Base#
 * @param {*} val
 * Overwrites default set handler and uses val for the property your defining
 * setting to true returns the current instance of Base
 */
exports.useVal = '_useVal'

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
 * @property Constructor
 * @memberOf Base#
 * Overwrites Child
 * @param {*} val
 * if val is string tries to get this[val]
 */
exports.Child = function (val, stamp) {
  var type = typeof val
  if (type === 'string') {
    val = this[val]
  } else if (val && type !== 'function' && val.Constructor) {
    val = val.Constructor
  } else if (type === 'object') {
    if (this.hasOwnProperty('Child')) {
      // this is fast but dangerous TODO CLEAN UP
      this.Child.prototype.set(val, false)
      return
    }
    val = new this.Child(val, stamp, this).Constructor
  }
  if (val) {
    val.prototype._isChild = this
  }
  this.define({ Child: val })
}

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
    if (stamp) {
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
// exports.origin = function (val, stamp) {
//   this.origin().set(val, stamp)
// }

// /**
//  * @property set
//  * @memberOf Base#
//  * @param {*} function - add a lowlevel hook to the set method, gaurds for change
//  */
// exports.set = function (fn) {
//   var _set = this.set
//   this.define({
//     set (val, stamp) {
//       let base = _set.apply(this, arguments)
//       if (base) {
//         fn.call(base, val, stamp)
//       }
//       return base
//     }
//   })
// }

/**
 * @property mapProperty
 * @memberOf Base#
 * @param {function} val - maps properties
 */
exports.mapProperty = function (val) {
  const mp = this.mapProperty
  this.define({
    mapProperty () {
      var result = mp.apply(this, arguments)
      if (!result) {
        result = val.apply(this, arguments)
      }
      return result
    }
  })
}
