'use strict'
/**
 * @function clearContext
 * Clears context of a base
 * @memberOf Base#
 * @type {base}
 */
exports.clearContext = function () {
  if (this.__c) {
    this._cLevel = null
    this.__c = null
  }
  return this
}

/**
 * @function clearContextUp
 * Clears all context over the parent chain
 * @memberOf Base#
 * @param {int} level - Specify maximum amount of levels to clear
 * @type {base}
 */
exports.clearContextUp = function (level) {
  var parent = this
  var i = 0
  while (parent && i < level) {
    i++
    parent.clearContext()
    parent = parent._parent
  }
  return this
}

/**
 * @function isContextCandidate
 * check if a key is a candidate for context getters
 * @memberOf Base#
 * @todo: needs perf optmization
 * @return {*} returns the field value or undefined
 */
exports.contextCandidate = function (key) {
  var value = this[key]
  if (
    value &&
    value.createContextGetter &&
    // value._parent === this && // this is incredibly heavy
    !value.noContext &&
    (
      key[0] !== '_'
      // has to be fixed this is what went wrong with on
      // this.properties &&
      // this.properties.keyMap[key] // really unperformant check
    ) &&
    // value._parent &&
    value._parent === this
  ) {
    return value
  }
}
