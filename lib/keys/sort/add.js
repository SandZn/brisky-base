'use strict'

module.exports = function (parent, target, keys, field) {
  const len = keys.length
  var order = field in target && target[field]
  if (!order) {
    let origin = target.origin()
    order = field in origin && origin[field]
  }
  if (order) {
    if (typeof order === 'object' && 'isBase' in order) {
      order = order.compute()
    }
  } else {
    order = 0
  }
  const orders = keys._ || (keys._ = [])
  if (len > 1) {
    for (let i = len - 2; i > -1; i--) {
      if (parent.sortMethod(order, orders[i]) > -1) {
        orders.push(order)
        return len - 1
      } else if (parent.sortMethod(order, orders[i]) < 0) {
        if (i === 0) {
          keys.unshift(keys.pop())
          orders.unshift(order)
          return i
        } else if (parent.sortMethod(order, orders[i - 1]) > -1) {
          keys.splice(i, 0, keys.pop())
          orders.splice(i, 0, order)
          return i
        }
      }
    }
  }
  orders.push(order)
  return 0
}
