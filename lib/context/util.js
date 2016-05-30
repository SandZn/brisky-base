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
exports.contextCandidate = function (target) {
  console.log(this._keys, target)
  if (
    !target.noContext &&
    target._parent === this
  ) {
    return target
  }
}

/**
 * @function storeContext
 * stores context for reapplying with applyContext
 * @memberOf Base#
 * @todo: needs perf optmization
 * @return {array} returns store
 */
exports.storeContext = function () {
  var context = this.__c
  if (context) {
    const arr = []
    let level = this._cLevel
    while (context) {
      arr.push(context, level)
      level = context._cLevel
      context = context.__c
    }
    return arr
  }
}

/**
 * @function applyContext
 * applies context to base
 * @memberOf Base#
 */
exports.applyContext = function (store) {
  if (store) {
    const l = store.length
    for (let i = 0, t = this; i < l; i = i + 2) {
      t._cLevel = store[i + 1]
      t.__c = t = store[i]
    }
  }
}
