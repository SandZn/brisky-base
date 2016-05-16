'use strict'
const Base = require('../')
const descriptors = require('vigour-util/descriptors')

module.exports = function (val, stamp) {
  this.Constructor
  const properties = val.properties
  const myProperties = this.properties
  const definitions = descriptors(val)
  const mydefs = descriptors(this)
  var newProps
  var overrides = properties._overrides
  var resolveOverrides
  for (let i in properties) {
    if (properties[i] !== myProperties[i] && i !== '_propertiesBind' && i !== '_overrides') {
      if (!newProps) { newProps = {} }
      newProps[i] = properties[i]
    }
  }
  if (newProps) {
    if (overrides) {
      resolveOverrides = {}
      for (let i in overrides) {
        if (newProps[i]) {
          resolveOverrides[overrides[i]] = i
          if (newProps[i].base) {
            newProps[i] = {
              val: newProps[i].base,
              override: overrides[i]
            }
          } else {
            newProps[i] = overrides[i]
          }
        }
      }
    }
    this.properties = newProps
  }
  for (let i in val) {
    let j = i
    if (resolveOverrides && resolveOverrides[i]) {
      j = resolveOverrides[i]
    }
    if (definitions[i]) {
      delete definitions[i]
    }
    if ((i[0] !== '_' || properties[i]) && this[i] !== val[i]) {
      if (this[i]) {
        if (this[i] instanceof Base) {
          this[i].inject(val[i], stamp)
        } else {
          this[i] = val[i]
        }
      } else {
        let set = val[i]
        if (set instanceof Base) {
          set = new set.Constructor({ noReference: true }, stamp, this)
          this.set({ [j]: set }, stamp)
        } else {
          if (myProperties[j] || properties[j]) {
            this.set({ [j]: set }, stamp)
          }
        }
      }
    }
  }
  for (let i in definitions) {
    if (i !== '_injected') {
      if (!compareDescriptors(definitions[i], mydefs[i])) {
        Object.defineProperty(this, i, definitions[i])
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

