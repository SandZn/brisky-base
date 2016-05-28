'use strict'
const quickSort = require('./quick')

module.exports = exports = function (target, keys, field, left, right) {
  if (!right) { right = keys.length - 1 }
  if (!left) { left = 0 }
  const orders = keys._ || (keys._ = new Array(keys.length))
  quickSort(target, keys, left, right, field, orders)
}

exports.add = function (parent, target, keys, field) {
  const len = keys.length
  var order = field in target && target[field]
  if (order) {
    if (typeof order === 'object' && 'isBase' in order) {
      order = order.compute()
    }
  } else {
    order = 0
  }
  const orders = keys._ || (keys._ = [])
  orders.push(order)
  if (len > 1) {
    const index = len - 1
    // update needs to find it self as well
    // try to reuse a bit in update
    for (let i = len - 2; i > -1; i--) {
      if (order > orders[i]) {
        break
      } else if (order < orders[i]) {
        if (i === 0) {
          keys.unshift(keys[index])
          keys.pop()
          orders.unshift(orders[index])
          orders.pop()
          break
        } else if (order > orders[i - 1]) {
          keys.splice(i, 0, keys[index])
          keys.pop()
          orders.splice(i, 0, orders[index])
          orders.pop()
          break
        }
      }
    }
  }
}

exports.update = function update (parent, target, keys) {
  console.log('update!')
}
