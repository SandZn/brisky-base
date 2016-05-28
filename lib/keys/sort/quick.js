module.exports = function quickSort (target, arr, left, right) {
  var pivot, index
  if (left < right) {
    pivot = right
    index = check(target, arr, pivot, left, right)
    quickSort(target, arr, left, index - 1)
    quickSort(target, arr, index + 1, right)
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
