'use strict'
/**
 * @function resolveContext
 * resolves context on set
 * creates instances up to the point where a set within context is performed
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {stamp} stamp current stamp
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */
module.exports = function (val, stamp, context, target, path) {
  context = context || this.__c
  if (!target) { target = this }
  var i = this._cLevel
  const level = i
  var iterator = target

  if (!path) { path = createPath(path, iterator, i) }

  if (context.__c) {
    let cpath = createPath(false, context, context._cLevel)
    context = context.resolveContext(val, stamp, context.__c, target, cpath.concat(path))
    return context
  }

  let len = path.length
  let end = len - 1

  for (i = 0; i < len; i++) {
    if (context) {
      let segment = path[i]
      let key = segment
      let prop = context[key]
      let set
      if (i === end) {
        set = val
      } else {
        set = {}
      }
      context = context.setKeyInternal(key, set, false, true, prop)
    }
  }
  this.clearContextUp(level)
  return context
}

function createPath (path, iterator, i) {
  path = path || []
  while (i) {
    let key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }
  return path
}
