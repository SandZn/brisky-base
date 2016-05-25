'use struct'
const isEmpty = require('vigour-util/is/empty')

exports.remove = function (props, key) {
  if (exports.isMapped(props, key)) {
    delete props.keyMap[key]
    if (isEmpty(props.keyMap)) {
      delete props.keyMap
    }
  }
}

exports.add = function (props, key, mapKey) {
  if (!('keyMap' in props)) {
    props.keyMap = {}
  }
  props.keyMap[key] = mapKey
}

exports.isMapped = function (props, key) {
  return key && 'keyMap' in props && props.keyMap && key in props.keyMap
}
