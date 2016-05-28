'use strict'
module.exports = function quickSort (target, keys, left, right) {
  var pivot, index
  if (left < right) {
    pivot = right
    index = partition(target, keys, pivot, left, right)
    quickSort(target, keys, left, index - 1)
    quickSort(target, keys, index + 1, right)
  }
  return keys
}

function partition (target, keys, pivot, left, right) {
  const pivotValue = target[keys[pivot]].order
  var index = left
  for (let i = left; i < right; i++) {
    // dont do this fill in ._ array -- if its there fill it as well
    if (target[keys[i]].order < pivotValue) {
      swap(keys, i, index)
      index++
    }
  }
  swap(keys, right, index)
  return index
}

function swap (keys, i, j) {
  const temp = keys[i]
  keys[i] = keys[j]
  keys[j] = temp
}
