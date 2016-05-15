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

var cnt = 0
// function is arround 4x faster -- seems dirty but is a micro optmization for v8
function mapFastV8 (target, key, stamp) {
  var checks = ''
  for (var prop in target._properties) {
    if (target._properties[prop] && prop !== '_propertiesBind') {
      checks += '\n  key === \'' + prop + '\' ||'
    }
  }
  checks = checks.slice(0, -2)
  var str = 'if(' + checks + '\n) { return key }'
  return (target._mapProperty = Function('key', str)) // eslint-disable-line
}

exports.property = function parseproperty (key, val, stamp, resolve, nocontext) {
  var m = this._mapProperty
  if (!m) {
    if (cnt > 400) {
      m = mapFastV8(this._mapTarget)
      this._mapTarget._mapTarget = null
      return m(key)
    } else {
      cnt++
      if (key in this._properties) {
        return key
      }
    }
  } else {
    return m(key)
  }
}

exports.setKey = function (key, val, stamp, resolve, nocontext) {
  var prop = this.property(key, val, stamp, resolve, nocontext)
  if (prop) {
    return this._properties[prop].call(this, val, stamp, resolve, nocontext, prop)
  } else {
    return this.setKeyInternal(key, val, stamp, nocontext, this[key])
  }
}
