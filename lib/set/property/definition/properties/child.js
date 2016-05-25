'use strict'
var isObj = require('vigour-util/is/obj')
/**
   * @property Constructor
   * @memberOf Base#
   * Overwrites child
   * @param {*} val
   * if val is string tries to get this[val]
 */
module.exports = function (val, stamp) {
  if (isObj(val)) {
    val = this.getType(val, stamp)
  }
  const type = typeof val
  if (type === 'string') {
    val = this[val]
  } else if (val && type !== 'function' && val.Constructor) {
    val = val.Constructor
  } else if (type === 'object') {
    if (this.hasOwnProperty('child')) {
      this.child.prototype.set(val, false)
      return
    }
    val = new this.child(val, stamp, this).Constructor // eslint-disable-line
  }
  if (val) {
    val.prototype._ischild = this
  }
  this.define({ child: val })
}
