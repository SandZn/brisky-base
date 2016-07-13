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

 // clean up and rename
exports.applyContext = function (store) {
  if (store) {
    const l = store.length
    for (let i = 0, target = this; i < l; i = i + 2) {
      let context = store[i]
      let level = store[i + 1]
      let path = [ target ]
      setContext(target, context, level, path)
      let base = handleChange(target, context, path, level)
      if (base) {
        // dont return need to handle doubles !!!
        return base
      }
    }
  }
  return void 0
}

function handleChange (target, context, path, level) {
  var newContext, newLevel
  var travelTaget = context
  for (let n = 0, len = path.length; n < len; n++) {
    if (travelTaget) {
      let field = travelTaget[path[n].key]
      if (field !== path[n]) {
        path[n].__c = null
        path[n]._cLevel = null
        newContext = field
        newLevel = len - (n + 1)
      }
      travelTaget = field
    } else {
      // target can change as well NEED TO HANDLE
      console.log('could be a removed FIELD somehwere lets verify!', target.path())
    }
  }
  if (newContext) {
    console.log('its new', context.realPath(), target.realPath(), level, newLevel)
    console.log('changed need to reset context')
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
      for (let j = 1; j < level; j++) {
        if (path) { path.unshift(p) }
        p.__c = context
        p._cLevel = target._cLevel - j
        p = p._parent
      }
    }
  }
}

function removeContext (target, level) {
  console.log('go clear it')
  if (level) {
    target._cLevel = null
    target.__c = null
    if (level > 1) {
      let p = target._parent
      for (let j = 1; j < level; j++) {
        p.__c = null
        p._cLevel = null
        p = p._parent
      }
    }
  }
}
