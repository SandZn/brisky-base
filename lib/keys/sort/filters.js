'use strict'
const indexOf = require('./indexof')

exports.add = function add (target, key, filtered, index) {
  let keys = target._keys
  if (filtered[index] !== keys[index]) {
    let indexOfNext = -1
    let i = index + 1
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
}

exports.sort = function sort (target, keys) {
  const filters = target._filters
  for (let type in filters) {
    filters[type] = resort(filters[type], keys)
  }
}

exports.update = function update (target, key, index, newIndex) {
  const parent = target.cParent()
  exports.sort(parent, parent._keys)
}

function resort (filter, keys) {
  const arr = []
  console.log('filter diff', keys.length, filter.length)
  for (let i = 0, len = keys.length; i < len; i++) {
    if (indexOf(filter, keys[i]) !== -1) {
      arr.push(keys[i])
    }
  }
  return arr
}
