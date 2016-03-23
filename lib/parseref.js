'use strict'
module.exports = function getRef (obs, val) {
  const rootObj = obs.getRoot()
  const comparep = obs.cachedPath()
  var target = rootObj
  var useParent
  var fromString
  if (typeof val === 'string') {
    val = val.split('/')
    fromString = true
  }

  if (val[0][1] === '.') {
    let path = obs.path()
    for (let i = 1, len = val.length; i < len; i++) {
      path.push(val[i])
    }
    val = path
  } else {
    // guarantees immutability of the set input
    if (!fromString) {
      val = val.concat()
    }
    val.shift()
  }

  // @todo slow optmize later (walks the array twice fo this functionality)
  for (let i in val) {
    if (
      val[i] === '..' ||
      val[i] === 'parent' ||
      val[i] === '_parent'
    ) {
      val.splice(i - 1, 2)
    }
  }

  for (let i = 0, length = val.length; i < length; i++) {
    let segment = val[i]
    if (!target[segment] || useParent) {
      if (comparep[i] == val[i] && isParent(comparep, val, i)) { // eslint-disable-line
        useParent = true
      } else {
        val = val.slice(i)
        if (useParent) {
          let l = (comparep.length - 1) - i
          let p = obs
          while (l > -1) {
            p = p._cLevel === 1 ? p._c : p._parent
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
  for (let i = 0; i < len; i++) {
    if (arr[i] != val[i]) { //eslint-disable-line
      return
    }
  }
  return true
}
