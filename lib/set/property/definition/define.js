'use strict'
const property = require('./property')
const keymap = require('./keymap')
const move = require('./move')
const removeFromKeyMap = keymap.remove
const addToKeyMap = keymap.add
const isMapped = keymap.remove

module.exports = function define (target, val, props, stamp) {
  for (let key in val) {
    defineProperty(target, key, val[key], props, stamp)
  }
}

function defineProperty (target, key, val, props, stamp) {
  var mapKey = val.key
  const keyIsNull = mapKey === null
  const hasVal = 'val' in val
  const prop = key in props && props[key]

  if (mapKey) {
    move(target, key, val, props, stamp, prop, mapKey)
    addToKeyMap(props, key, mapKey)
  }

  if (hasVal) {
    const removeKey = keyIsNull && isMapped(props, key)
    val = val.val
    console.log('yo yo yo', key, mapKey)
    if (!mapKey && mapKey !== 0) {
      mapKey = key
    }
    props[key] = property(target, mapKey, val, props, stamp, prop, key) || null
    if (removeKey && isMapped(props, key)) {
      console.log('SHOULD REMOVE IT OR MOVE IT NOW!', key)
      // move(target, key, val, props, stamp, prop, mapKey)
      removeFromKeyMap(props, key)
    }
  } else {
    if (keyIsNull) {
      move(target, key, val, props, stamp, prop, key)
      removeFromKeyMap(props, key)
    }
  }
}
