'use strict'
const isObj = require('brisky-is-obj')
const define = Object.defineProperty
/**
 * @function inject
 * inject modules into bases usesfull pattern if you inject modules multiple times
 * @param {*...} val repeats for each argument
 * function, calls and do special stuff on inject
 * object, calls .set on base
 * base (not supported yet) acts as a mixin
 * @todo add base mixin support
 * @memberOf Base#
 * @return {Base} returns new instance of property Constructor
 */
exports.inject = function () {
  var length = arguments.length
  const stamptarget = arguments[length - 1]
  var stamp
  var type = !stamptarget || typeof stamptarget
  if (
    type !== 'function' && type !== 'object'
  ) {
    stamp = arguments[length - 1]
    length = length - 1
  }
  for (let i = 0; i < length; i++) {
    inject.call(this, arguments[i], stamp)
  }
  return this
}

function inject (val, stamp) {
  var isFn
  isFn = typeof val === 'function'
  if (isFn && val.prototype && val.prototype.isBase) {
    val = val.prototype
    isFn = null
  }
  var injected = val._injected
  if (!val.hasOwnProperty('_injected')) {
    define(val, '_injected', {
      configurable: true,
      value: []
    })
    injected = val._injected
  } else {
    for (let i = 0, length = injected.length; i < length; i++) {
      let target = injected[i]
      if (this === target ||
        (target.hasOwnProperty('_Constructor') &&
        target._Constructor &&
        (this instanceof target._Constructor)
        )
      ) {
        // allready injected
        return
      }
    }
  }
  injected.push(this)
  if (isFn) {
    val(this, stamp)
  } else if (isObj(val)) {
    if (this.isBase) {
      this.set(val, stamp)
    }
  } else if (val.isBase) {
    console.log('deprecate!')
    // injectBase(this, val, stamp)
  }
}
