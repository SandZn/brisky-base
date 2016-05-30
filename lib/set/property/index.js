'use strict'
/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Stamp} [stamp] Current event
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
exports.isProperty = require('./definition/is')

exports.setKey = function (key, val, stamp, resolve, nocontext) {
  const prop = this.isProperty(key, val, stamp)
  if (prop) {
    return this.properties[prop].call(this, val, stamp, resolve, nocontext, prop)
  } else {
    return this.setKeyInternal(key, val, stamp, nocontext, this[key])
  }
}
