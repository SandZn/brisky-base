'use strict'
var isObj = require('brisky-is-obj')
/**
   * @property Constructor
   * @memberOf Base#
   * Overwrites child
   * @param {*} val
   * if val is string tries to get this[val]
 */
module.exports = function (val, stamp) {
  if (isObj(val)) {
    console.log('xxxxxxxxxxxx')
    // val, stamp, key, nocontext, params, isChild
    val = this.getType(val, stamp, void 0, void 0, void 0, true)
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
    console.log('xxxxxxxxxxxx')
    val = new this.child(val, stamp, this).Constructor // eslint-disable-line
  }
  console.log('hello', val)
  this.define({ child: val })
}
