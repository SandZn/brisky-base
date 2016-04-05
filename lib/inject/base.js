'use strict'
var Base = require('../')
var descriptors = require('vigour-util/descriptors')
// CLEAN UP needs tests, does not take all edge cases into account such as overrides
module.exports = function (val, stamp) {
  this.Constructor
  var properties = val.properties
  var myProperties = this.properties
  // var overrides = val.overrides
  var definitions = descriptors(val)
  var mydefs = descriptors(this)
  for (let i in properties) {
    if (properties[i] !== myProperties[i] && i !== 'binds') {
      this.properties = { [i]: properties[i] }
    }
  }
  for (let i in val) {
    if (definitions[i]) {
      delete definitions[i]
    }
    if (i[0] === '_' && !properties[i]) {

    } else {
      if (i === 'overrides') {
        console.log('WARN: inject: merging base-like object -- overrides not handled yet')
      } else {
        if (this[i] !== val[i]) {
          if (this[i]) {
            if (this[i] instanceof Base) {
              this[i].inject(val[i], stamp)
            }
            // this[i]
          } else {
            let set = val[i]
            if (set instanceof Base) {
              set = new set.Constructor({ noReference: true }, stamp, this)
              this.set({ [i]: set }, stamp)
            } else {
              if (myProperties[i] || properties[i]) {
                this.set({ [i]: set }, stamp)
              }
            }
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

