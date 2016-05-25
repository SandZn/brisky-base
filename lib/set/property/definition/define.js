'use strict'
const property = require('./property')
const removeFromKeyMap = require('./keymap').remove
const addToKeyMap = require('./keymap').add

module.exports = function define (target, val, props, stamp) {
  for (let key in val) {
    defineProperty(target, key, val[key], props, stamp)
  }
}

function defineProperty (target, key, val, props, stamp) {
  const mapKey = val.key
  const keyIsNull = mapKey === null
  const hasVal = 'val' in val
  const prop = key in props && props[key]

  if (mapKey) {
    moveKey(target, key, val, props, stamp, prop, mapKey)
    addToKeyMap(props, key, mapKey)
  }

  if (hasVal) {
    const removeKey = keyIsNull && isMapped(props, key)
    val = val.val
    props[key] = property(target, mapKey, val, props, stamp, prop, key) || null
    if (removeKey && isMapped(props, key)) {
      console.log('SHOULD REMOVE IT NOW!', key)
      removeFromKeyMap(props, key)
    }
  } else {
    if (keyIsNull) {
      moveKey(target, key, val, props, stamp, prop, key)
      removeFromKeyMap(props, key)
    }
  }
}

function isMapped (props, key) {
  return 'keyMap' in props && key in props.keyMap && props.keyMap[key]
}

function moveKey (target, key, val, props, stamp, prop, mapKey) {
  if (isMapped(props, key)) {
    // dont move when reset: false
    if (target[props.keyMap[key]] !== null && target[props.keyMap[key]] !== void 0) {
      if (target[props.keyMap[key]].isBase) {
        target[props.keyMap[key]]
        target[props.keyMap[key]].noReference = true
        target.set({
          [mapKey]: target[props.keyMap[key]]
        }, stamp)
        target[props.keyMap[key]].noReference = null
        target[props.keyMap[key]] = null
      } else {
        target[mapKey] = target[props.keyMap[key]]
        target[props.keyMap[key]] = null
      }
    }
  }
}
