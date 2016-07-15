'use strict'
module.exports = function order (i, target, keys, field, orders) {
  if (orders[i] !== void 0) {
    return orders[i]
  } else {
    const key = keys[i]
    target = target[key]
    let order = field in target && target[field]
    if (!order) {
      let origin = target.origin()
      if (origin !== target) {
        order = field in origin && origin[field]
      }
    }
    if (order) {
      if (typeof order === 'object' && 'isBase' in order) {
        order = order.compute()
      }
    } else {
      order = 0
    }
    orders[i] = order
    return order
  }
}
