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
    console.log('go go go')
    let cpath = createPath(false, context, context._cLevel)
    context = context.resolveContext(val, stamp, context.__c, target, cpath.concat(path))
    return context
  }

  let len = path.length
  let end = len - 1
  let prev

  for (i = 0; i < len; i++) {
    if (context) {
      prev = context
      let segment = path[i]
      let key = typeof segment === 'string' ? segment : segment.key
      let prop = context[key]
      let set
      if (i === end) {
        set = val
      } else {
        set = {}
      }
      // double check if not having the stamp here is correct need to add more tests
      context = context.setKeyInternal(key, set, false, true, prop)
      if (!context) {
        // this happens on removal
        console.log('AND HERE STRANGE', key)
        // prevContext??? what does this do exactly
        context = prev[key]
      }
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
