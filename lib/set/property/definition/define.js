'use strict'
const property = require('./property')
const keymap = require('./keymap')
const move = require('./move')
const removeFromKeyMap = keymap.remove
const addToKeyMap = keymap.add
const mapDefaultProperty = require('./default').map
const baseProperty = require('./base')

module.exports = function define (target, val, props, stamp) {
  for (let key in val) {
    defineProperty(target, key, val[key], props, stamp)
  }
}

function defineProperty (target, key, val, props, stamp) {
  var prop = key in props && props[key]
  const mapKey = val.key
  const keyIsNull = mapKey === null
  const hasVal = 'val' in val
  const reset = 'reset' in val ? val.reset : void 0
  const targetKey = mapKey && mapKey !== 0 ? mapKey : key

  if (mapKey) {
    move(target, key, props, stamp, prop, mapKey, reset)
    addToKeyMap(props, key, mapKey)
  }
  if (hasVal) {
    props[key] = property(
      target, targetKey, val.val, props, stamp, prop, key, reset
    ) || null
  } else if (prop) {
    if (mapKey || keyIsNull) {
      if (prop.base) {
        prop = props[key] = baseProperty(prop.base, targetKey)
      } else {
        prop = props[key] = mapDefaultProperty(targetKey, targetKey !== key && key)
      }
    }
    if (keyIsNull) {
      move(target, key, props, stamp, prop, key, reset)
      removeFromKeyMap(props, key)
    }
  }
}
