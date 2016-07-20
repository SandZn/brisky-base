'use strict'
exports.create = function (target) {
  if (!target._filters) {
    target._filters = {}
  }
}

exports.types = function (target, key, type) {
  target = target[key]
  return 'keyType' in target && target.keyType === type
}

exports.add = function addFilter (target, key, copy, sIndex) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = getType(target, key)
  const filtered = type && filters[type]
  if (filtered) {
    if (sIndex !== void 0) {
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
    } else {
      filtered.push(key)
    }
  }
}

function indexOf (arr, key) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] === key) {
      return i
    }
  }
}

exports.remove = function removeFilter (target, key, copy) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = getType(target, key)
  const filtered = type && filters[type]
  if (filtered) {
    if (filtered.length === 1) {
      filters[type] = []
    } else {
      for (let i = 0, len = filtered.length; i < len; i++) {
        if (filtered[i] === key) {
          filtered.splice(i, 1)
          break
        }
      }
    }
  }
}

exports.copy = copyFilters

function getType (target, key) {
  return target[key].keyType ||
    ('filter' in target && target.filter(key) && 'keys')
}

function copyFilters (filters) {
  const newFilters = {}
  for (let type in filters) {
    newFilters[type] = filters[type].concat()
  }
  return newFilters
}
