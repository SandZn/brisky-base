'use strict'

global.cnt = 0
exports.add = function (parent, target, arr, field) {
  // combine creation for extra speed
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

exports.remove = function (index, arr) {
  if (arr._) {
    arr._.splice(index, 1)
  }
}

exports.update = function update (parent, target, arr) {
  console.log('update!')
}

// quick is only for total sort (when you add field ordered)
// lets renome to "sort" // true is only thing that is supported later add method
exports.quick = function quick (target, arr, left, right) {
  var pivot, index
  if (left < right) {
    pivot = right
    index = check(target, arr, pivot, left, right)
    quick(target, arr, left, index - 1)
    quick(target, arr, index + 1, right)
  }
  return arr
}

function check (target, arr, pivot, left, right) {
  const pivotValue = target[arr[pivot]].order
  var index = left
  for (let i = left; i < right; i++) {
    // dont do this fill in ._ array -- if its there fill it as well
    if (target[arr[i]].order < pivotValue) {
      swap(arr, i, index)
      index++
    }
  }
  swap(arr, right, index)
  return index
}

function swap (arr, i, j) {
  const temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}
