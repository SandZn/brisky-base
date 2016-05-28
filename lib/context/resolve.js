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
  var prevContext
  var level = i
  var iterator = target

  if (!path) {
    path = pathMaker(path, iterator, i)
  }

  if (context.__c) {
    console.log('go go go')
    let cpath = pathMaker(false, context, context._cLevel)
    context = context.resolveContext(val, stamp, context.__c, target, cpath.concat(path))
    return context
  }

  let pathLength = path.length
  let pathLengthCompare = pathLength - 1

  for (i = 0; i < pathLength; i++) {
    if (context) {
      prevContext = context
      let segment = path[i]
      let key = typeof segment === 'string' ? segment : segment.key
      let prop = context[key]
      let set
      if (i === pathLengthCompare) {
        set = val
      } else {
        set = {}
      }
      // double check if not having the stamp here is correct need to add more tests
      context = context.setKeyInternal(key, set, false, true, prop)
      if (!context) {
        context = prevContext[key]
      }
    }
  }
  this.clearContextUp(level)
  return context
}

function pathMaker (path, iterator, i) {
  path = path || []
  while (i) {
    let key = iterator.key
    path.unshift(key)
    iterator = iterator._parent
    i--
  }
  return path
}
