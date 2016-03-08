'use strict'
const Base = require('../')
const ref = '$'

/**
 * @function converts the Base object into a string or normal object. It can also filter certain keys and velues.
 * @memberOf Base#
 * @param  {function} filter function
 * @return {object | string}
 * @example
 */
exports.define = {
  serialize: function (filter, calculate) {
    var obj = {}
    var val = this.__input
    // this can become arround a million times faster
    this.each(function (property, key, base) {
      obj[key] = property.serialize ? property.serialize(filter, calculate) : property
    }, filter)
    if (val !== void 0) {
      if (val instanceof Base) {
        var path = val.path
        path.unshift(ref)
        val = path
      } else if (calculate) {
        val = this.val
      }
      if (!this.keys()) {
        obj = val
      } else {
        obj.val = val
      }
    }
    return obj
  }
}
