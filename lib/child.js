'use strict'
var isObj = require('vigour-util/is/obj')
/**
   * @property Constructor
   * @memberOf Base#
   * Overwrites Child
   * @param {*} val
   * if val is string tries to get this[val]
 */
exports.properties = {
  Child (val, stamp) {
    if (isObj(val)) {
      val = this.getType(val, stamp)
    }
    const type = typeof val
    if (type === 'string') {
      val = this[val]
    } else if (val && type !== 'function' && val.Constructor) {
      val = val.Constructor
    } else if (type === 'object') {
      if (this.hasOwnProperty('Child')) {
        this.Child.prototype.set(val, false)
        return
      }
      val = new this.Child(val, stamp, this).Constructor
    }
    if (val) {
      val.prototype._isChild = this
    }
    this.define({ Child: val })
  }
}
