'use strict'
const property = require('./property')

module.exports = function define (target, val, props, stamp) {
  for (let key in val) {
    defineProperty(target, key, val[key], props, stamp)
  }
}

function defineProperty (target, key, val, props, stamp) {
  let prop = key in props && props[key]
  let mapKey = val.key
  if (mapKey) {

  } else {

  }
  if (val.val) {
    console.log(val.val, mapKey)
    props[key] =
      property(target, mapKey, val.val, props, stamp, prop, key) ||
      null
  } else {
    console.log('no val.val do this later')
  }
}
