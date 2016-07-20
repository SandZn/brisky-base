'use strict'
exports.create = function (target) {
  if (!target._filters) {
    target._filters = {}
  }
}

exports.copy = copyFilters

exports.types = function (target, key, type) {
  target = target[key]
  return 'keyType' in target && target.keyType === type
}

// make this in a method then we can overwrite and add 'true' index
exports.add = function addFilter (target, key, copy, sIndex) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = getType(target, key)
  console.log('?', type)
  if (filters[type]) {
    if (sIndex !== void 0) {
      let keys = target._keys
      if (filters[type][sIndex] !== keys[sIndex]) {
        let indexOfNext = -1
        let i = sIndex + 1
        while (indexOfNext === -1 && i < keys.length) {
          indexOfNext = filters[type].indexOf(keys[i])
          i++
        }
        if (indexOfNext !== -1) {
          filters[type].splice(indexOfNext, 0, key)
        } else {
          filters[type].push(key)
        }
      } else {
        filters[type].push(key)
      }
    } else {
      filters[type].push(key)
    }
  }
}

exports.remove = function removeFilter (target, key, copy) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = getType(target, key)
  if (type && filters[type]) {
    if (filters[type].length === 1) {
      filters[type] = []
    } else {
      for (let i = 0, len = filters[type].length; i < len; i++) {
        if (filters[type][i] === key) {
          filters[type].splice(i, 1)
          break
        }
      }
    }
  }
}

function getType (target, key) {
  return target[key].keyType || ('filter' in target && target.filter(key) && 'keys')
}

function copyFilters (filters) {
  const newFilters = {}
  for (let type in filters) {
    newFilters[type] = filters[type].concat()
  }
  return newFilters
}
