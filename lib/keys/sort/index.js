'use strict'
const quickSort = require('./quick')
const order = require('./order').compute
const filters = require('./filters').sort

module.exports = exports = function sort (target, keys, field, left, right) {
  console.log('resort -- needs to update instances as well (SORT/index)')
  const orders = keys._ || (keys._ = [])
  if (!right) { right = keys.length - 1 }
  if (!left) { left = 0 }
  if (right < 1) {
    if (right === 0) {
      orders[0] = order(target[keys[0]], field)
    }
  } else {
    quickSort(target, keys, left, right, field, orders)
  }
  // need more for this -- easier way or extra function
  if (keys === target._keys) {
    filters(target, keys)
    const instances = target.instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        let instance = instances[i]
        if (instance._keys !== keys) {
          instance._keys._ = []
          // this is very much for resort
          sort(instance, instance._keys, field)
          console.log(instance._keys)
        }
      }
    }
  }
}
