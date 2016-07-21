'use strict'
// const order = require('./order')
// need this for efficient resort
// use this for all in filter
module.exports = function update (target, keys, key, field) {
  console.log('update!', keys, key, field)

  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i] === key) {

    }
  }

  if (keys === target._keys) {
    // do stuff for filters
  }
}
