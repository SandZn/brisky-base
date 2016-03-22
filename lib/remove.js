'use strict'
var Base = require('./')
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
    if (this._context) {
      this.resolveContext(null, stamp, context)
    }
  } else {
    parent[this.key] = null
    // this.clearContext()
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
  if (
    property instanceof Base &&
    key !== '_context' &&
    this.hasOwnProperty(key) &&
    property._parent === this
  ) {
    property.clearContext()
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
      // make this 1000x faster, and add a system for this blacklisted[key]
      key !== '_parent' &&
      key !== 'key' &&
      key !== '_uid' &&
      key !== '_key' &&
      key !== 'val' &&
      key !== '_lstamp' &&
      key !== 'storedmap' &&
      key !== '_hashCache' &&
      key !== '_hashedpath' &&
      key !== 'cachedSyncPath' &&
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
  var parent = this._parent
  if (!noparent && !nocontext && this._context) {
    return this.removeUpdateParent(this.parent, stamp, this._context)
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
  var ret = this.removeInternal(stamp, nocontext, noparent)
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
    // use stamp here this is messed up
    stamp = 'clear'
  }
  this.each((property) => {
    property.remove(stamp)
  })
  if (trigger) {
    // stamp.trigger()
  }
}
