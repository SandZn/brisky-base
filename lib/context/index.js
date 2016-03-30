'use strict'
/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  const cont = this.__c
  const level = this._cLevel
  var value = this.contextCandidate(key)
  if (value) {
    let privateKey = '_' + key
    this[privateKey] = value
    for (let val_key in value) {
      value.createContextGetter(val_key)
    }
    Object.defineProperty(this, key, {
      get () {
        // has to be a mwthod -- also when doing this lets mark the field
        // _key then try to get _key first allways faster
        const value = this[privateKey]
        if (value) {
          if (!this.hasOwnProperty(privateKey)) {
            value.__c = this
            value._cLevel = 1
          } else if (this.__c) {
            value._cLevel = this._cLevel + 1
            value.__c = this.__c
          } else {
            value.clearContext()
          }
        }
        return value
      },
      set (val) {
        this[privateKey] = val
      },
      configurable: true
    })
  }
  if (!cont) {
    this.clearContext()
  } else if (cont !== this.__c) {
    this.__c = cont
    this._cLevel = level
  }
}

/**
 * @function resolveContext
 * resolves context on set
 * creates instances up to the point where a set within context is preformend
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {stamp} stamp current stamp
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */
exports.resolveContext = function (val, stamp, context, target, path) {
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
      let prop = context[key] || segment.__cTarget__
      let set

      if (i === pathLengthCompare) {
        set = val
      } else {
        set = {}
      }
      context = context.setKeyInternal(key, set, stamp, true, prop)
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
    if (iterator._cKey) {
      path.unshift({ key: key, __cTarget__: iterator })
    } else {
      path.unshift(key)
    }
    iterator = iterator._parent
    i--
  }
  return path
}
