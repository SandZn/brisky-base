'use strict'
const order = require('./order').compute
const updateFilters = require('./filters').update

module.exports = function update (target, field, keys, parent) {
  var hasFilters, index, newIndex
  if (!parent) {
    parent = target.cParent()
  }
  if (!keys) {
    keys = parent._keys
    hasFilters = '_filters' in parent
  } else if (keys === parent._keys) {
    hasFilters = '_filters' in parent
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
    if (newOrder > oldOrder) {
      for (let i = index; i < len; i++) {
        if (orders[i] > newOrder) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i, 0, key)
          orders.splice(i, 0, order)
          newIndex = i
          break
        } else if (i === len - 1) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.push(key)
          orders.push(order)
          newIndex = i
        }
      }
    } else {
      for (let i = index; i > -1; i--) {
        if (orders[i] < newOrder) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i, 0, key)
          orders.splice(i, 0, order)
          newIndex = i
          break
        } else if (i === 0) {
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.unshift(key)
          orders.unshift(order)
          newIndex = i
        }
      }
    }
    if (hasFilters) {
      updateFilters(target, key, index, newIndex)
    }

    // clean this up
    if (keys === parent._keys) {
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
