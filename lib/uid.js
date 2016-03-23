'use strict'
var uid = 0
// canidate for deprecation (does not seem to be sued anywhere anymore)

/**
 * @property uid
 * injectable for generation of uids -- handy if you want weakmap-like behaviour
 * @memberOf Base#
 * @param {object} val
*/
exports.define = {
  uid () {
    if (!this.hasOwnProperty('_uid')) {
      uid++
      this._uid = uid
    }
    return this._uid
  }
}
