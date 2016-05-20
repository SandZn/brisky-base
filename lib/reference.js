'use strict'
module.exports = function reference (obs, val, stamp) {
  const rootObj = obs.getRoot()
  const comparep = obs.realPath(void 0, true)
  var target = rootObj
  var useParent

  if (val[1] === '.') {
    val = val.split('.')
    let path = obs.realPath()
    for (let i = 1, len = val.length; i < len; i++) {
      path.push(val[i])
    }
    val = path
  } else {
    val = val.split('.')
    val.shift()
  }

  // @todo slow optmize later (walks the array twice fo this functionality)
  for (let i in val) {
    if (
      val[i] === 'parent' ||
      val[i] === '_parent'
    ) {
      val.splice(i - 1, 2)
    }
  }

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
            p = p._cLevel === 1 ? p.__c : p._parent
            l--
          }
          return p.get(val, {}, false)
        } else {
          return target.get(val, {}, false)
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
    if (arr[i] != val[i]) { // eslint-disable-line
      return
    }
  }
  return true
}
