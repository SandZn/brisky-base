'use strict'
const property = require('./property')
const clear = require('./clear')

module.exports = function define (target, val, props, stamp) {
  for (let key in val) {
    defineProperty(target, key, val[key], props, stamp)
  }
}

function defineProperty (target, key, val, props, stamp) {
  let prop = key in props && props[key]
  let mapKey = val.key

  if (mapKey) {
    if (!('keyMap' in props)) {
      props.keyMap = {}
    } else if (prop && key in props.keyMap && props.keyMap[key]) {
      // dont move when reset: false
      if (target[props.keyMap[key]] !== null && target[props.keyMap[key]] !== void 0) {
        console.log(target)
        if (target[props.keyMap[key]].isBase) {
          console.log('MOVE IS BASE')
        } else {
          target[mapKey] = target[props.keyMap[key]]
          target[props.keyMap[key]] = null
        }
      }
    }
    props.keyMap[key] = mapKey
  } else if (prop && mapKey === null && 'keyMap' in props && key in props.keyMap && prop.keyMap[key]) {
    clear(target, mapKey, props, stamp, prop, key)
    console.log('remove keyMap call clear -- but dont clear the prop!')
  }

  if ('val' in val) {
    val = val.val
    props[key] = property(target, mapKey, val, props, stamp, prop, key) || null
  } else {
    console.log('no val.val do this later')
  }
}
