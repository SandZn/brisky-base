'use strict'
const quickSort = require('./quick')
const order = require('./order').compute
const resortFilters = require('../filters').resort

module.exports = exports = function (target, keys, field, left, right) {
  if (!right) { right = keys.length - 1 }
  if (!left) { left = 0 }
  const orders = keys._ || (keys._ = [])
  if (!right) {
    if (keys.length) {
      orders[0] = order(target[keys[0]], field)
    }
  } else {
    quickSort(target, keys, left, right, field, orders)
  }
  // need more for this -- easier way or extra function
  if (keys === target._keys) {
    resortFilters(target, keys, field, left, right)
  }
}
