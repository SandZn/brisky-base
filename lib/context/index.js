'use strict'
const define = Object.defineProperty // maybe use define for this

/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
exports.createContextGetter = function (key) {
  const cont = this._context
  const level = this._contextLevel
  var value = this.contextCandidate(key)
  if (!value) {
    key = '_' + key
    value = this[key]
    if (
      value &&
      this.hasOwnProperty(key) &&
      !value.hasOwnProperty('_Constructor') &&
      value._Constructor
    ) {
      for (let val_key in value) {
        value.createContextGetter(val_key)
      }
    }
  } else if (value) {
    let privateKey = '_' + key
    this[privateKey] = value
    for (let val_key in value) {
      value.createContextGetter(val_key)
    }
    define(this, key, {
      get () {
        const value = this[privateKey]
        if (value) {
          if (!this.hasOwnProperty(privateKey)) {
            value._context = this
            value._contextLevel = 1
          } else if (this._context) {
            value._contextLevel = this._contextLevel + 1
            value._context = this._context
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
  } else if (cont !== this._context) {
    this._context = cont
    this._contextLevel = level
  }
}

/**
 * @function resolveContext
 * resolves context sets
 * @memberOf Base#
 * @param {*} val set value to be resolved
 * @param {event} event current event
 * @param {base} context resolve this context
 * @param {boolean} alwaysreturn when set to true always returns resolved base
 * @type {base|undefined}
 */
exports.resolveContext = function (val, event, context, target, path) {
  context = context || this._context
  var i = this._contextLevel
  var path
  var prevContext
  var level = i

  if (!target) {
    target = this
  }

  var iterator = target

  if (!path) {
    path = pathMaker(path, iterator, i)
  }

  if (context._context) {
    let cpath = pathMaker(false, context, context._contextLevel)
    context = context.resolveContext(val, event, context._context, target, cpath.concat(path))
    return context
  }

  var pathLength = path.length
  var pathLengthCompare = pathLength - 1

  for (i = 0; i < pathLength; i++) {
    if (context) {
      prevContext = context
      let segment = path[i]
      let key = typeof segment === 'string' ? segment : segment.key
      let prop = context[key] || segment.__contextTarget__
      let set

      if (i === pathLengthCompare) {
        set = val
      } else {
        set = {}
      }

      context = context.setKeyInternal(key, set, prop, event, true)
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
    if (iterator._contextKey) {
      path.unshift({ key: key, __contextTarget__: iterator })
    } else {
      path.unshift(key)
    }
    // lp = iterator
    iterator = iterator._parent
    i--
  }
  return path
}
