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
  if (this.key === null) {
    return
  }
  if (parent[this.key] === null) {
    return true
  }
  if (context) {
    if (this.__c) {
      this.resolveContext(null, stamp, context)
    }
  } else {
    parent.clearKeys(this)
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
exports.removeProperty = function (property, key, stamp, nocontext) {
  // needs optmization
  if (
    property instanceof Base &&
    key !== '__c' &&
    this.hasOwnProperty(key) &&
    property._parent === this
  ) {
    property.clearContext()
    this.clearKeys(property)
    property.remove(stamp, nocontext)
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
  var target = this
  // this will be fixed as well -- dont need this shit
  // again lets use a keys array super efficient
  for (let key in target) {
    if (
      // this can be a bit cleaner.....
      // can be at least 10x faster, and add a system for this e.g. blacklisted[key]
      // or a regexp test the difference
      key !== '_parent' &&
      key !== 'key' &&
      key !== '_uid' &&
      key !== '_key' &&
      key !== 'val' &&
      key !== '_lstamp' &&
      key !== '_memoizedPath' &&
      key !== 'type'
    ) {
      if (this.hasOwnProperty('_' + key) || this.hasOwnProperty(key)) {
        target = target.removeProperty(target[key], key, stamp, nocontext) || target
      } else if (target[key] && target[key].clearContext) {
        target[key].clearContext()
      }
    }
  }
  target.val = null
}

/**
 * @function removeInternal
 * remove properties from base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param {noparent} [boolean] dont remove from parent when true
 * @return {true|undefined} if true no updates happened on parent
 * @todo return a base when a change happened (consistency)
 */
exports.removeInternal = function (stamp, nocontext, noparent) {
  const parent = this._parent
  if (!noparent && !nocontext && this.__c) {
    return this.removeUpdateParent(this.parent, stamp, this.__c)
  } else {
    if (!noparent && parent) {
      this.removeUpdateParent(parent, stamp)
    }
    this.removeProperties(stamp, nocontext, noparent)
    this._parent = null
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
exports.remove = function (stamp, nocontext, noparent) {
  const ret = this.removeInternal(stamp, nocontext, noparent)
  if (this.removeFromInstances) {
    this.removeFromInstances(stamp)
  }
  return ret
}

/**
 * @function clear
 * clears all properties and values of a base
 * @memberOf Base#
 * @param {stamp} stamp passedon stamp
 * @todo return a base when a change happened (consistency)
 */
exports.clear = function (stamp) {
  this.val = void 0
  var trigger
  if (stamp === void 0) {
    trigger = true
    stamp = vstamp.create()
  }
  this.each((property) => {
    property.remove(stamp)
  })
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
  // double check this
  this[key] = null
  return this
}
