'use strict'
module.exports = function indexOf (arr, key) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === key) {
      return i
    }
  }
}
