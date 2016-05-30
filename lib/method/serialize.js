'use strict'
const ref = '$root'

/**
 * @function converts the Base object into a string or normal object. It can also filter certain keys and velues.
 * @memberOf Base#
 * @param  {function} filter function
 * @return {object | string}
 * @example
 */
exports.define = {
  serialize: function (compute, filter) {
    var obj = {}
    var val = this.val
    this.each(function (property, key, base) {
      obj[key] = property.serialize ? property.serialize(compute, filter) : property
    }, filter)
    if (val !== void 0) {
      if (compute) {
        val = this.compute()
      } else if (val && typeof val === 'object' && val.isBase) {
        let path = val.realPath()
        path.unshift(ref)
        val = path.join('.')
      }
      if (this.keys().length === 0) {
        obj = val
      } else {
        obj.val = val
      }
    }
    return obj
  }
}
