'use strict'
/**
 * @function compute
 * parses output, can be references, itself, input value or ouput
 * bind is used as the callee to pass to functions defined in val
 * @memberOf Base#
 * @param {*} previous  previous value continue parsing
 * @param {*} start first value of current parsed value loop
 * @param {stamp} current stamp resulting in compute
 * @param {*} attach attach a value
 */

exports.compute = function (val, previous, start, stamp, attach) {
  if (val === void 0) {
    val = this.val
  }
  if (val !== void 0) {
    const type = typeof val
    if (type === 'function') {
      val = val.call(this, previous, start, stamp, attach)
    } else if (type === 'object' && val && val.isBase) {
      val = val.compute(void 0, void 0, start, stamp)
    }
  } else {
    val = previous !== void 0 ? previous : this
  }
  return val
}

/**
 * @function origin
 * returns the origin of the value (resolved over references)
 * @type {base}
 */
exports.origin = function () {
  var reference = this
  var val = reference.val
  while (val && typeof val === 'object' && val.isBase) {
    reference = val
    val = reference.val
  }
  return reference
}
