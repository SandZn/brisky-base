'use strict'
const Base = require('../')
const descriptors = require('vigour-util/descriptors')

module.exports = function (target, val, stamp, excludes) {
  target.getConstructor()
  const properties = val.properties
  const keyMap = properties.keyMap
  const myProperties = target.properties
  const definitions = descriptors(val)
  const mydefs = descriptors(target)
  var newProps
  var resolveKeyMap
  for (let i in properties) {
    if (properties[i] !== myProperties[i] && i !== '__attached__' && i !== 'keyMap') {
      if (!newProps) { newProps = {} }
      newProps[i] = properties[i]
    }
  }
  if (newProps) {
    if (keyMap) {
      resolveKeyMap = {}
      for (let i in keyMap) {
        if (newProps[i]) {
          resolveKeyMap[keyMap[i]] = i
          if (newProps[i].base) {
            newProps[i] = {
              val: newProps[i].base,
              override: keyMap[i]
            }
          } else {
            newProps[i] = keyMap[i]
          }
        }
      }
    }
    target.properties = newProps
  }
  for (let i in val) {
    let j = i
    if (resolveKeyMap && resolveKeyMap[i]) {
      j = resolveKeyMap[i]
    }
    if (definitions[i]) {
      delete definitions[i]
    }
    if (
      (i[0] !== '_' || properties[i]) &&
      target[i] !== val[i] &&
      (!excludes || excludes.indexOf(i) === -1)
    ) {
      if (target[i]) {
        if (target[i] instanceof Base) {
          target[i].inject(val[i], stamp)
        } else {
          target[i] = val[i]
        }
      } else {
        let set = val[i]
        if (set instanceof Base) {
          set = new set.Constructor({ noReference: true }, stamp, target)
          target.set({ [j]: set }, stamp)
        } else {
          if (myProperties[j] || properties[j]) {
            target.set({ [j]: set }, stamp)
          }
        }
      }
    }
  }
  for (let i in definitions) {
    if (i !== '_injected') {
      if (!compareDescriptors(definitions[i], mydefs[i])) {
        Object.defineProperty(target, i, definitions[i])
      }
    }
  }
}

function compareDescriptors (a, b) {
  if (a && !b) {
    return false
  }
  for (let i in a) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

