'use strict'
const quickSort = require('./quick')
exports.add = add

exports.sort = function sort (target, keys) {
  const filters = target._filters
  for (let type in filters) {
    let filtered = filters[type]
    quickSort(target, filtered, 0, filtered.length - 1, target.sort, [])
  }
}

exports.update = function sort (target, keys, oldIndex, newIndex, key) {
  const filters = target._filters
  for (let type in filters) {
    let pass = type === 'keys'
      ? target.filter(key)
      : target[key].keyType === type
    if (pass) {
      let filtered = filters[type]
      let i = oldIndex
      let found
      while (found === void 0 && i > -1) {
        if (filtered[i] === key) {
          found = i
        } else {
          i--
        }
      }
      filtered.splice(found, 1)
      add(target, key, filtered, newIndex, type)
    }
  }
}

function add (target, key, filtered, index, type) {
  const len = filtered.length
  if (len > 0) {
    const keys = target._keys
    if (index === 0) {
      filtered.unshift(key)
    } else if (len === keys.length - 1) {
      filtered.splice(index, 0, key)
    } else {
      let left = -1
      let i = index - 1
      if (type === 'keys') {
        while (left === -1 && i > -1) {
          if (target.filter(keys[i])) {
            left = keys[i]
          }
          i--
        }
      } else {
        while (left === -1 && i > -1) {
          if (target[keys[i]].keyType === type) {
            left = keys[i]
          }
          i--
        }
      }
      if (left === -1) {
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
        filtered.splice(found + 1, 0, key)
      }
    }
  } else {
    filtered.push(key)
  }
}
