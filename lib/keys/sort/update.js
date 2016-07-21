'use strict'
const order = require('./order').compute
// need this for efficient resort
// use this for all in filter
module.exports = function update (target, field, keys) {
  var filters, index
  const parent = target.cParent()
  if (!keys) {
    keys = parent._keys
    filters = parent._filters
  } else if (keys === parent._keys) {
    filters = parent._filters
  }
  const key = target.key
  const len = keys.length
  const orders = keys._
  if (!orders) {
    throw new Error('cannot resort dont have orders!')
  }
  // use indexOf util, do perf tests with native in node -- saves lots of code
  for (let i = 0; i < len; i++) {
    if (keys[i] === key) {
      index = i
      break
    }
  }
  const newOrder = order(target, field)
  const oldOrder = orders[index]
  if (newOrder !== oldOrder) {
    console.log('its time order changed!')
    console.log(index, newOrder, oldOrder)
    if (newOrder > oldOrder) {
      for (let i = index; i < len; i++) {
        if (orders[i] > newOrder) {
          console.log('right hur!', i)
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i, 0, key)
          orders.splice(i, 0, order)
          break
        } else if (i === len - 1) {
          console.log('largest!')
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.push(key)
          orders.push(order)
        }
      }
    } else {
      for (let i = index; i > -1; i--) {
        if (orders[i] > newOrder) {
          console.log('right hur!', i)
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.splice(i, 0, key)
          orders.splice(i, 0, order)
          break
        } else if (i === 0) {
          console.log('smallest!')
          orders.splice(index, 1)
          keys.splice(index, 1)
          keys.unshift(key)
          orders.unshift(order)
        }
      }
    }
  }

  // need to handle instances as well
  if (filters) {
    console.log('lets handle those filters')
    // do filters
  }
}

// this is the part where we are going to use functions (funcitons can transform to int thats the idea at least)
