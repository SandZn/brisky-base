'use strict'
const indexOf = require('./indexof')

exports.add = function add (target, key, filtered, index) {
  const len = filtered.length
  if (len > 0) {
    const keys = target._keys
    if (index === 0) {
      filtered.unshift(key)
    } else if (len === keys.length) {
      filtered.splice(index, 0, key)
    } else {
      let left = -1
      let i = index - 1
      while (left === -1 && i) {
        if (target.filter(keys[i])) {
          left = keys[i]
        }
        i--
      }
      if (!left) {
        filtered.unshift(key)
      } else {
        i = index - 1
        let found
        while (i > -1 && found === void 0) {
          if (filtered[i] === left) {
            found = i
          } else {
            i--
          }
        }
        if (found === void 0) {
          filtered.unshift(key)
        } else {
          filtered.splice(found + 1, 0, key)
        }
      }
    }
  } else {
    filtered.push(key)
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
  // dont really need update funciton here.... -- just call sort
}
