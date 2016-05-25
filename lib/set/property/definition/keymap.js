'use struct'
const isEmpty = require('vigour-util/is/empty')

exports.remove = function (props, key) {
  if (key) {
    const keyMap = 'keyMap' in props && props.keyMap
    if (keyMap && keyMap[key]) {
      delete keyMap[key]
      if (isEmpty(keyMap)) {
        delete props.keyMap
      }
    }
  }
}

exports.add = function (props, key, mapKey) {
  if (!('keyMap' in props)) {
    props.keyMap = {}
  }
  props.keyMap[key] = mapKey
}
