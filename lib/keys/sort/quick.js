'use strict'
module.exports = function quickSort (target, keys, left, right, field, orders) {
  var pivot, index
  if (left < right) {
    pivot = right
    index = partition(target, keys, pivot, left, right, field, orders)
    quickSort(target, keys, left, index - 1, field, orders)
    quickSort(target, keys, index + 1, right, field, orders)
  }
  return keys
}

function partition (target, keys, pivot, left, right, field, orders) {
  const pivotValue = order(pivot, target, keys, field, orders)
  var index = left
  for (let i = left; i < right; i++) {
    if (order(i, target, keys, field, orders) < pivotValue) {
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

function order (index, target, keys, field, orders) {
  if (orders[index] !== void 0) {
    return orders[index]
  } else {
    target = target[keys[index]]
    var order = field in target && target[field]
    if (order) {
      if (typeof order === 'object' && 'isBase' in order) {
        order = order.compute()
      }
    } else {
      order = 0
    }
    orders[index] = order
    return order
  }
}
