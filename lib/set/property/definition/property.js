'use strict'
const clear = require('./clear')
const mapDefaultProperty = require('./default').map
const baseProperty = require('./base')
const set = require('./set')

function property (target, key, val, props, stamp, prop, realKey, reset) {
  const isObj = val && typeof val === 'object'
  const isBase = isObj && 'isBase' in val
  const isFn = !isObj && typeof val === 'function'
  const isSet = !reset && !isBase && !isFn && val !== true && val !== null
  const hasType = isObj && !isBase && 'type' in val

  if (prop) {
    if (
      reset !== false &&
      (!isSet || !('base' in prop) || hasType && val.type !== prop.base.type)
    ) {
      clear(target, key, props, stamp, prop, realKey)
    } else if (isSet) {
      return set(target, key, val, props, stamp, realKey, reset)
    }
  }

  if (val === true) {
    return mapDefaultProperty(key, realKey)
  } else if (isFn || val === null) {
    return val
  }

  if (isBase) {
    if (val._Constructor) {
      val = new val._Constructor(void 0, stamp, target, key)
    }
  } else {
    const type = hasType && target.getType(val, stamp, key)
    const Constructor = type && type.Constructor || target.child
    val = new Constructor(val, stamp, target, key)
  }

  return baseProperty(val, key)
}

module.exports = property
