'use strict'
const order = require('./order').apply
module.exports = function quickSort (target, keys, left, right, field, orders) {
  if (left < right) {
    const pivot = right
    const index = partition(target, keys, pivot, left, right, field, orders)
    quickSort(target, keys, left, index - 1, field, orders)
    quickSort(target, keys, index + 1, right, field, orders)
  }
  return keys
}

function partition (target, keys, pivot, left, right, field, orders) {
  const val = order(pivot, target, keys, field, orders)
  const sortMethod = target.sortMethod
  var index = left
  for (let i = left; i < right; i++) {
    if (sortMethod(order(i, target, keys, field, orders), val) < 1) {
      swap(keys, i, index)
      swap(orders, i, index)
      index++
    }
  }
  swap(keys, right, index)
  swap(orders, right, index)
  return index
}

function swap (keys, i, j) {
  const temp = keys[i]
  keys[i] = keys[j]
  keys[j] = temp
}
