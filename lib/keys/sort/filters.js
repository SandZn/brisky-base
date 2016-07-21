'use strict'
const indexOf = require('./indexof')

exports.add = function add (target, key, filtered, sIndex) {
    // move this to sort!
  let keys = target._keys
  if (filtered[sIndex] !== keys[sIndex]) {
    let indexOfNext = -1
    let i = sIndex + 1
    // can be greatly optmized
    while (indexOfNext === -1 && i < keys.length) {
      indexOfNext = indexOf(filtered, keys[i])
      i++
    }
    if (indexOfNext !== -1) {
      filtered.splice(indexOfNext, 0, key)
    } else {
      filtered.push(key)
    }
  } else {
    filtered.push(key)
  }
  // move it to sort
}

exports.resort = function resort (target, keys, field, left, right) {
  console.log('FILTERS - needs optmization')
  const filters = target._filters
  for (let type in filters) {
    filters[type] = resortKeys(filters[type], keys)
    console.log('need to update instances as well! (resort filters)')
  }
}

function resortKeys (filter, keys) {
  // use quick for this
  // this is the worsed do it with swaps please
  // USE SWAPS DONT MAKE NEW SHIT
  // ALSO NEEDS TO UPDATE INSTANCES
  var last = -1
  const arr = []
  for (let i = 0, len = filter.length; i < len; i++) {
    let index = indexOf(keys, filter[i])
    if (index !== -1) {
      if (index >= last) {
        arr.push(filter[i])
      } else {
        arr.unshift(filter[i])
      }
      last = index
    }
  }
  return arr
}
