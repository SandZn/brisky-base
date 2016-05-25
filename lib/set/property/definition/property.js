'use strict'
const clear = require('./clear')
const defaultProperty = require('./default')
const baseProperty = require('./base')
const set = require('./set')

module.exports = function setProperty (target, key, val, props, stamp) {
  // hopefully this is the only place where we need to manage key override stuff
  const prop = key in props && props[key]
  props[key] = property(target, key, val, props, stamp, prop) || null
}

function property (target, key, val, props, stamp, prop) {
  const isObj = val && typeof val === 'object'
  const isBase = isObj && 'isBase' in val
  const isFn = !isObj && typeof val === 'function'
  const isSet = !isBase && !isFn && val !== true && val !== null
  const hasType = isObj && !isBase && 'type' in val

  if (prop) {
    if (!isSet || !('base' in prop) || hasType && val.type !== prop.base.type) {
      clear(target, key, props, stamp, prop) // clear may need a reference to key
    } else if (isSet) {
      return set(target, key, val, props, stamp)
    }
  }

  if (val === true) {
    return defaultProperty
  } else if (isFn || val === null) {
    return val
  }

  // can do better
  if (isBase) {
    if (val._Constructor) {
      val = new val._Constructor(void 0, stamp, target, key)
    }
  } else {
    const type = hasType && target.getType(val, stamp, key)
    const Constructor = type && type.Constructor || target.Child
    val = new Constructor(val, stamp, target, key)
  }

  return baseProperty(val, key)
}
