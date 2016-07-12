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
    let x
    for (let i = 0, t = this; i < l; i = i + 2) {
      let context = store[i]
      let level = store[i + 1]
      let path = [ t ]
      setContext(t, context, level, path)
      // verification round -- may be nessecary even for level === 1
      let ta = context
      let newContext
      let newLevel
      for (let n = 0, len = path.length; n < len; n++) {
        if (ta) {
          let target = ta[path[n].key]
          if (target !== path[n]) {
            path[n].__c = null
            path[n]._cLevel = null
            newContext = target
            newLevel = len - (n + 1)
          }
          ta = target
        } else {
          setContext(t, context, 0, [ t ], level)
          if (i === l - 2) {
            if (l > 2) {
              console.log('!!!', context)
              if (!x) {
                x = [ context ]
                x.__doubleWeird = true
              } else {
                x.push(context)
              }
              x.push(level)
              console.log('x -- yo', x)
              // more multiple this is pretty hard..
            }
            return void 0
          }
        }
      }
      if (newContext) {
        console.log('its new', context.realPath(), t.realPath())
        context = store[i] = newContext
        setContext(t, context, newLevel, [ t ], level)
        level = store[i + 1] = newLevel
      }
      if (level) {
        t.__c = t = context
      } else {
        if (i === l - 2) {
          if (l > 2) {
            console.log('yo')
          }
          return void 0
        }
      }
    }
  }
  return store
}

function setContext (t, context, level, path, old) {
  if (level) {
    t._cLevel = level
    t.__c = context
    if (level > 1) {
      let p = t._parent
      for (let j = 1; j < level; j++) {
        path.unshift(p)
        p.__c = context
        p._cLevel = t._cLevel - j
        p = p._parent
      }
    }
  } else if (old) {
    t._cLevel = null
    t.__c = null
    if (old > 1) {
      let p = t._parent
      for (let j = 1; j < old; j++) {
        p.__c = null
        p._cLevel = null
        p = p._parent
      }
    }
  }
}
