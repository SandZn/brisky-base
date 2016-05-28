'use strict'
const quickSort = require('./quick')

module.exports = exports = function (target, keys, left, right) {
  if (!right) { right = keys.length }
  if (!left) { left = 0 }
  quickSort(target, keys, left, right)
}

exports.add = function (parent, target, arr, field) {
  const len = arr.length
  var order = field in target && target[field]
  if (order) {
    if (typeof order === 'object' && 'isBase' in order) {
      order = order.compute()
    }
  } else {
    order = 0
  }
  const orders = arr._ || (arr._ = [])
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
          arr.unshift(arr[index])
          arr.pop()
          orders.unshift(orders[index])
          orders.pop()
          break
        } else if (order > orders[i - 1]) {
          arr.splice(i, 0, arr[index])
          arr.pop()
          orders.splice(i, 0, orders[index])
          orders.pop()
          break
        }
      }
    }
  }
}

exports.update = function update (parent, target, arr) {
  console.log('update!')
}
