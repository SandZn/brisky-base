'use strict'
const order = require('./order').compute
const updateFilters = require('./filters').update

module.exports = function update (target, field, keys, parent) {
  var hasFilters, index, newIndex, isKeys
  if (!parent) {
    parent = target.cParent()
  }
  if (!keys) {
    keys = parent._keys
    hasFilters = parent._filters
    isKeys = true
  } else if (keys === parent._keys) {
    hasFilters = parent._filters
    isKeys = true
  }
  const key = target.key
  const len = keys.length
  const orders = keys._
  for (let i = 0; i < len; i++) {
    if (keys[i] === key) {
      index = i
      break
    }
  }
  const newOrder = order(target, field)
  const oldOrder = orders[index]
  if (newOrder !== oldOrder) {
    const sortMethod = parent.sortMethod
    if (sortMethod(newOrder, oldOrder) > -1) {
      for (let i = index; i < len; i++) {
        if (i === len - 1) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.push(key)
          orders.push(newOrder)
          newIndex = i
        } else if (sortMethod(newOrder, orders[i]) < 0) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i, 0, key)
          orders.splice(i, 0, newOrder)
          newIndex = i
          break
        }
      }
    } else {
      for (let i = index; i > -1; i--) {
        if (i === 0) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.unshift(key)
          orders.unshift(newOrder)
          newIndex = i
        } else if (sortMethod(newOrder, orders[i]) > 0) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i + 1, 0, key)
          orders.splice(i + 1, 0, newOrder)
          newIndex = i
          break
        }
      }
    }
    if (hasFilters) {
      updateFilters(parent, parent._keys, index, newIndex, key)
    }
    if (isKeys) {
      const instances = parent.instances
      if (instances) {
        for (let i = 0, len = instances.length; i < len; i++) {
          let instance = instances[i]
          if (instance._keys !== keys && instance[key] === target) {
            update(target, field, instance._keys, instance)
          }
        }
      }
    }
  }
}
