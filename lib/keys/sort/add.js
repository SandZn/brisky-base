'use strict'
module.exports = function (parent, target, keys, field) {
  const len = keys.length
  var order = field in target && target[field]
  if (order) {
    if (typeof order === 'object' && 'isBase' in order) {
      order = order.compute()
      console.log(order)
    }
  } else {
    order = 0
  }
  const orders = keys._ || (keys._ = [])
  orders.push(order)
  if (~target.path().join().indexOf('23187a')) {
    console.log('my key:', target.key)
    console.log('orders:', orders)
    console.log('keys:', keys)
  }
  if (len > 1) {
    const index = len - 1
    for (let i = len - 2; i > -1; i--) {
      if (order > orders[i]) {
        break
      } else if (order < orders[i]) {
        if (i === 0) {
          if (~target.path().join().indexOf('23187a')) {
            console.log('ha:', orders, orders[index])
          }
          keys.unshift(keys.pop())
          orders.unshift(orders.pop())
          break
        } else if (order >= orders[i - 1]) {
          if (~target.path().join().indexOf('23187a')) {
            console.log('hoe:', orders)
          }
          keys.splice(i, 0, keys.pop())
          orders.splice(i, 0, orders.pop())
          break
        }
      }
    }
  }
  if (~target.path().join().indexOf('23187a')) {
    console.log('keys._', keys._)
  }
}
