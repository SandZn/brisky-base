'use strict'
const Base = require('../../../../')
const defaultProperty = require('../default').property
exports.child = require('./child')

/**
 * @property __attached__
 * __attached__ means the current Base properties are bound to
 * @memberOf Properties#
 */
exports.__attached__ = Base.prototype

/**
 * @property rootOverride
 * @memberOf Base#
 * @param {*} boolean
 * Limits cached path and getRoot() to the rootOveride
 */
exports.rootOverride = defaultProperty

/**
 * @property noReference
 * @memberOf Base#
 * @param {*} val
 * Overwrites default set handler when a value does not have a parent
 * it will use the value immedialty
 * usefull for things like dom-elements
 * setting to true returns the current instance of Base
 */
exports.noReference = defaultProperty

/**
 * @property noContext
 * @memberOf Base#
 * @param {*} boolean
 * Block automatic creation of contexts getters and instances
 */
exports.noContext = defaultProperty

/**
 * @property Constructor
 * @memberOf Base#
 * Overwrites Constructor
 * @param {*} val
 */
exports.Constructor = defaultProperty

/**
 * @property key
 * @memberOf Base#
 * @param {String} val - Sets key
 */
exports.key = defaultProperty

/**
 * @property bind
 * @memberOf Base#
 * @param {*} val - bind this value on emitter, and .compute
 */
exports.bind = defaultProperty

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

exports.val = function (val, stamp, resolve, nocontext) {
  return this.setValue(val, stamp, resolve)
}
