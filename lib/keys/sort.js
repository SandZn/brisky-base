'use strict'
// combine looping and creation of keys when sort -- ad dis just rly rly annoying

exports.add = function (parent, target, arr) {
  let len = arr.length
  if (len > 1) {
    const order = target.order
    const index = len - 1
    for (let i = len - 2; i > -1; i--) {
      if (order < parent[arr[i]].order) {
        if (i === 0) {
          arr.unshift(arr[index])
          arr.pop()
          break
        } else if (order > parent[arr[i - 1]].order) {
          arr.splice(i, 0, arr[index])
          arr.pop()
          break
        }
      }
    }
  }
}

// exports change very important --storing index may be nice -- but dont do it -- just find where it is in keys
// exports.update = function (target, arr) {
//   let len = arr.length
//   if (len > 1) {
//     let order = target[arr[len - 1]]
//     for (let i = len - 2; i > -1; i--) {
//       console.log(target[arr[i]].order, order)
//     }
//   }
// }

// quick(target, arr, 0, arr.length - 1)
// resort ? better name?
exports.quick = function quick (target, arr, left, right) {
  var pivot, index
  if (left < right) {
    pivot = right
    // get prev / next optmize for add -- you know you want to start at the end and thats it
    // more of a insertion
    // only the last and there you go!
    // this is purely for creation
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
