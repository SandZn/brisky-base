'use strict'
const Base = require('./')
const vstamp = require('vigour-stamp')
/**
 * @function removeUpdateParent
 * remove base from parent
 * @memberOf Base#
 * @param {base} parent if not defined returns true
 * @param {stamp} stamp passedon stamp
 * @param {base} context checks if context has to be resolved
 * @return {boolean|undefined} if true nothing happened
 */
exports.removeUpdateParent = function (parent, stamp, context) {
  if (context) {
    if (this.__c) {
      this.resolveContext(null, stamp, context)
    }
  } else {
    parent.removeKey(this.key, this)
    parent[this.key] = null
  }
}

/**
 * @function removeProperty
 * removeProperty from a base
 * @memberOf Base#
 * @param {property} base property to be removed
 * @param {key} key of the property
 * @param {stamp} stamp passedon stamp
 * @param {base} context checks if context has to be resolved
 * @param {nocontext} [boolean] dont resolveContext when true
 * @return {boolean|undefined} if true nothing happened
 * @todo how to get rid of the non-enum stuff?
 * @todo cleanup and make faster
 * @todo system for excludes (e.g. noremovable or something)
 */
exports.removeProperty = function (property, key, stamp, nocontext, noParent) {
  if (
    property instanceof Base &&
    key !== '__c' &&
    this.hasOwnProperty(key) &&
    property._parent === this
  ) {
    property.clearContext()
    property.remove(stamp, nocontext, noParent)
  }
  this[key] = null
}

/**
 * @function removeProperties
 * remove properties from base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @param {nocontext} [boolean] dont resolveContext when true
 */
exports.removeProperties = function (stamp, nocontext) {
  if (this._keys) {
    for (let i = 0, len = this._keys.length; i < len; i++) {
      let key = this._keys[i]
      let k = '_' + key
      if (!(k in this) || this.hasOwnProperty(k)) {
        this.removeProperty(this[key], key, stamp, nocontext, true)
      } else {
        this[key].clearContext()
      }
    }
    this.removeAllKeys()
  }
}

/**
 * @function removeInternal
 * remove properties from base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param {noParent} [boolean] dont remove from parent when true
 * @return {true|undefined} if true no updates happened on parent
 * @todo return a base when a change happened (consistency)
 */
exports.removeInternal = function (stamp, noContext, noParent) {
  const parent = this._parent
  if (!noParent && !noContext && this.__c) {
    return this.removeUpdateParent(this.parent, stamp, this.__c)
  } else {
    if (!noParent && parent) {
      this.removeUpdateParent(parent, stamp)
    }
    this.removeProperties(stamp, noContext, noParent)
    this._parent = null
    this.val = null
  }
  this.clearContext()
}

/**
 * @function remove
 * remove a base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param {noparent} [boolean] dont remove from parent when true
 * @return {true|undefined} if true no updates happened
 * @todo return a base when a change happened (consistency)
 */
exports.remove = function (stamp, noContext, noParent) {
  const ret = this.removeInternal(stamp, noContext, noParent)
  this.removeFromInstances(stamp)
  return ret || this
}

/**
 * @function reset
 * removes all properties and values of a base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @todo return a base when a change happened (consistency)
 */
exports.reset = function (stamp) {
  this.val = void 0
  var trigger
  if (stamp === void 0) {
    trigger = true
    stamp = vstamp.create()
  }
  this.removeProperties(stamp)
  if (trigger) { vstamp.close(stamp) }
}

/**
 * removes context -- for base this just means nulling one property,
 * however observables need to fire remove events for context
 * @param  {[type]} key   [description]
 * @param  {[type]} event
 * @return {[type]}
 */
exports.contextRemove = function (key, event) {
  console.log('contextRemove (may be called to often!)')
  this.removeKey(key, this[key])
  this[key] = null
  return this
}
