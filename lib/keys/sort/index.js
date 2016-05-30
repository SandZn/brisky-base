'use strict'
const quickSort = require('./quick')

module.exports = exports = function (target, keys, field, left, right) {
  if (!right) { right = keys.length - 1 }
  if (!left) { left = 0 }
  const orders = keys._ || (keys._ = new Array(keys.length))
  quickSort(target, keys, left, right, field, orders)
}
