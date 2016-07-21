'use strict'
// this file needs incredeble perf improvement it rly sucks
const indexOf = require('./indexof')
// use indexOf util, do perf tests with native indexOf node -- saves lots of code

exports.add = function add (target, key, filtered, index) {
  let keys = target._keys
  if (filtered[index] !== keys[index]) {
    let indexOfNext = -1
    let i = index + 1
    while (indexOfNext === -1 && i < keys.length) {
      // same here this is just way way to heavy
      indexOfNext = indexOf(filtered, keys[i])
      i++
    }
    if (indexOfNext !== -1) {
      filtered.splice(indexOfNext, 0, key)
    } else {
      filtered.push(key)
    }
  }
}

// this funciton is retarded
exports.sort = function sort (target, keys, index, newIndex) {
  // want some kind of diff...
  const filters = target._filters
  var newFilters = {}
  for (let i = 0, len = keys.length; i < len; i++) {
    for (let type in filters) {
      let filter = filters[type]
      if (indexOf(filter, keys[i]) !== -1) {
        if (!newFilters[type]) {
          newFilters[type] = []
        }
        newFilters[type].push(keys[i])
      }
    }
  }
  for (let type in newFilters) {
    filters[type] = newFilters[type]
  }
}

exports.update = function update (target, key, index, newIndex) {
  const parent = target.cParent()
  exports.sort(parent, parent._keys, index, newIndex)
  // dont really need update funciton here....
}
