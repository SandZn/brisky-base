'use strict'
const sortAdd = require('./sort/filters').add

exports.create = function (target) {
  if (!target._filters) {
    target._filters = {}
  }
}

exports.types = function (target, key, type) {
  target = target[key]
  return 'keyType' in target && target.keyType === type
}

exports.add = function addFilter (target, key, copy, sort) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const type = getType(target, key)
  const filtered = type && filters[type]
  if (filtered) {
    if (sort !== void 0) {
      sortAdd(target, key, filtered, sort)
    } else {
      filtered.push(key)
    }
    console.log('need to update instances as well! (add filter)')
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
