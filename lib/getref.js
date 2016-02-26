'use strict'
module.exports = function getRef (obs, val) {
  var hub = obs.getRoot()
  var comparep = obs.syncPath
  var useParent
  val.shift()
  var target = hub
  for (let i = 0, length = val.length; i < length; i++) {
    let segment = val[i]
    if (!target[segment] || useParent) {
      if (comparep[i] == val[i] && isParent(comparep, val, i)) { //eslint-disable-line
        useParent = true
      } else {
        val = val.slice(i)
        if (useParent) {
          let l = (comparep.length - 1) - i
          let p = obs
          while (l > -1) {
            p = p._contextLevel === 1 ? p._context : p._parent
            l--
          }
          return p.get(val, {})
        } else {
          return target.get(val, {})
        }
      }
    } else {
      target = target[segment]
    }
  }
  return target
}

function isParent (arr, val, len) {
  for (var i = 0; i < len; i++) {
    if (arr[i] != val[i]) { //eslint-disable-line
      return
    }
  }
  return true
}
