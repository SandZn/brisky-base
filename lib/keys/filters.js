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

exports.add = function addFilter (target, key, copy) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = target[key].keyType
  if (filters[type]) {
    filters[type].push(key)
  }
}

exports.remove = function removeFilter (target, key, copy) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = target[key].keyType
  if (filters[type]) {
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

function copyFilters (filters) {
  const newFilters = {}
  for (let type in filters) {
    newFilters[type] = filters[type].concat()
  }
  return newFilters
}
