'use strict'
const quickSort = require('./quick')
const order = require('./order').compute
const filters = require('./filters').sort

module.exports = exports = function sort (target, keys, field) {
  const orders = keys._ = []
  const len = keys.length - 1
  if (len < 1) {
    if (len === 0) {
      orders[0] = order(target[keys[0]], field)
    }
  } else {
    quickSort(target, keys, 0, len, field, orders)
  }
  if (keys === target._keys) {
    filters(target, keys)
    const instances = target.instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        let instance = instances[i]
        if (instance._keys !== keys) {
          sort(instance, instance._keys, field)
        }
      }
    }
  }
}
