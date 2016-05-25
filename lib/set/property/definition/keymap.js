'use strict'
const isEmpty = require('vigour-util/is/empty')

exports.remove = function (props, key) {
  if (exports.isMapped(props, key)) {
    inherit(props)
    delete props.keyMap[key]
    if (isEmpty(props.keyMap)) {
      props.keyMap = null
    }
  }
}

exports.add = function (props, key, mapKey) {
  if (!('keyMap' in props && props.keyMap)) {
    props.keyMap = {}
  } else {
    inherit(props)
  }
  props.keyMap[key] = mapKey
}

exports.isMapped = function (props, key) {
  return key && 'keyMap' in props && props.keyMap && key in props.keyMap
}

function inherit (props) {
  if (!props.hasOwnProperty('keyMap')) {
    const prev = props.keyMap
    props.keyMap = {}
    for (let key in prev) {
      props.keyMap[key] = prev[key]
    }
  }
}
