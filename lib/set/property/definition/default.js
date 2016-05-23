'use strict'
module.exports = function defaultProperty (val, stamp, resolve, nocontext, key) {
  console.log('hello!', key)
  if (this[key] !== val) {
    this[key] = val
    return this
  }
}
