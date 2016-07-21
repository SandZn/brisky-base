'use strict'
exports.compute = (target, field) => {
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
  return order
}

exports.apply = (i, target, keys, field, orders) => {
  return orders[i] === void 0
    ? (orders[i] = exports.compute(target[keys[i]], field))
    : orders[i]
}
