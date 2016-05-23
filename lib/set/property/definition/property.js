'use strict'
const clear = require('./clear')
const defaultProperty = require('./default')

module.exports = function property (target, key, val, props, stamp) {
  // check if property exists and remove it
  // super importante!
  if (val === true) {
    props[key] = defaultProperty
  } else if (val === null) {
    clear(target, key, props, stamp)
  } else if (typeof val === 'function') {
    // constructors are no longer suported just but an object or base
    props[key] = val
  } else {
    console.log('BASE prop definition NOT THERE YET!', key)
    if (typeof val !== 'object') {
      console.log('WARN **** WARN *** WARN', key)
    }
  }
}
