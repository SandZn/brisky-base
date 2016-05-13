'use strict'
/**
 * @function parseValue
 * parses output, can be references, itself, input value or ouput
 * bind is used as the callee to pass to functions defined in val
 * @memberOf Base#
 * @param {*} previousValue  previous value continue parsing
 * @param {base} origin origin of current parsed value loop
 * @todo bind has to be used for emitters as well not only here!
 * @todo add more bind options e.g. parent.parent (be carefull with context!)
 */
exports.compute = function (val, previousValue, stamp, origin) {
  if (val === void 0) {
    val = this.val
  }
  if (val !== void 0) {
    let type = typeof val
    if (type === 'function') {
      val = val.call(this.getBind(previousValue, stamp), previousValue)
    } else if (type === 'object' && val && val._base_version) {
      val = val.compute(void 0, void 0, stamp, !origin ? this : origin)
    }
  } else {
    val = previousValue !== void 0 ? previousValue : this
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
  while (val && typeof val === 'object' && val._base_version) {
    reference = val
    val = reference.val
  }
  return reference
}
