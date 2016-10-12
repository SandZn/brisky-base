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

exports.add = function addFilter (target, key, sort, type) {
  var filters = target._filters
  const start = !type
  if (start) {
    type = target[key].keyType
  }
  const filtered = type && filters[type]
  if (filtered) {
    if (sort !== void 0) {
      // need to get the diff as well
      sortAdd(target, key, filtered, sort, type)
    } else {
      filtered.push(key)
    }
  }
  if (start && keysFilter(target, key)) {
    addFilter(target, key, sort, 'keys')
  }
}

exports.remove = function removeFilter (target, key, copy, type) {
  var filters = target._filters
  if (copy) {
    target._filters = filters = copyFilters(filters)
  }
  const start = !type
  if (start) {
    type = target[key].keyType
  }
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
  if (start && keysFilter(target, key)) {
    removeFilter(target, key, copy, 'keys')
  }
}

exports.copy = copyFilters

function keysFilter (target, key) {
  return 'filter' in target && target.filter(key)
}

function copyFilters (filters) {
  const newFilters = {}
  for (let type in filters) {
    newFilters[type] = filters[type].concat()
  }
  return newFilters
}
