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
    let ret
    for (let i = 0, target = this; i < l; i = i + 2) {
      let context = store[i]
      let level = store[i + 1]
      let path = [ target ]
      let newTarget = setContext(target, context, level, path)
      let base = handleChange(target, context, path, level)
      if (ret === void 0 && base !== void 0) {
        ret = base
      }
      if (newTarget) {
        target = newTarget
      }
    }
    return ret
  }
}

function handleChange (target, context, path, level) {
  var newContext, newLevel
  var travelTaget = context
  for (let i = 0, len = path.length; i < len; i++) {
    let segment = path[i]
    let field = travelTaget[segment.key]

    if (!field) {
      removeContext(target, level)
      return null
    } else if (field !== segment) {
      segment.__c = null
      segment._cLevel = null
      newContext = field
      newLevel = len - (i + 1)
    }
    travelTaget = field
    if (i === len - 1) {
      target = travelTaget
    }
  }
  if (newContext) {
    if (!newLevel) {
      removeContext(target, level)
    } else {
      setContext(target, newContext, newLevel)
    }
    return target
  }
}

function setContext (target, context, level, path) {
  if (level) {
    target._cLevel = level
    target.__c = context
    if (level > 1) {
      let p = target._parent
      for (let i = 1; p && i < level; i++) {
        if (path) { path.unshift(p) }
        p.__c = context
        p._cLevel = target._cLevel - i
        p = p._parent
      }
    }
    return context
  }
}

function removeContext (target, level) {
  if (level) {
    target._cLevel = null
    target.__c = null
    if (level > 1) {
      let p = target._parent
      for (let i = 1; p && i < level; i++) {
        p.__c = null
        p._cLevel = null
        p = p._parent
      }
    }
  }
}
