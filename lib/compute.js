'use strict'
var Base = require('./')

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
exports.compute = function (previousValue, stamp, origin) {
  // do previusValue better!
  // fix bind!
  var val
  // previous val is maybe a bad idea
  if (this.val !== void 0) {
    if (!origin) {
      origin = this
    }
    let input = this.val
    let output = this.output
    val = output !== void 0 ? output
        : input !== void 0 ? input : void 0

    if (val) {
      let bind = this.getBind(previousValue, stamp)
      if (bind) {
        if (typeof val === 'function') {
          val = val.call(bind, previousValue)
        } else if (val instanceof Base) {
          if (val !== origin) {
            val = val.compute(void 0, stamp, origin)
          }
        }
      }
    }
    if (val === void 0) {
      val = this
    }
  } else {
    val = previousValue
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
  while (reference.val instanceof Base) {
    reference = reference.val
  }
  return reference
}
