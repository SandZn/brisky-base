'use strict'
const quickSort = require('./quick')
const order = require('./order')

module.exports = exports = function (target, keys, field, left, right) {
  if (!right) { right = keys.length - 1 }
  if (!left) { left = 0 }
  const orders = keys._ || (keys._ = [])
  if (!right) {
    orders[0] = order(0, target, keys, field, orders)
  } else {
    quickSort(target, keys, left, right, field, orders)
  }
}
