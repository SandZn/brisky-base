'use strict'
const returnPath = require('./method/shared').returnPath
module.exports = function reference (obs, val, stamp) {
  const rootObj = obs.getRoot()
  const ownPath = obs.realPath(false, true)
  var target = rootObj
  var useParent
  if (val[1] === '.') {
    val = returnPath(val)
    const path = obs.realPath()
    for (let i = 1, len = val.length; i < len; i++) {
      path.push(val[i])
    }
    val = path
  } else {
    val = returnPath(val)
    val.shift()
  }

  // @todo slow optmize later (walks the array twice for this functionality)
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
    if (!target.get(segment) || useParent) {
      if (ownPath[i] === val[i] && isParent(ownPath, val, i, target)) {
        useParent = true
      } else {
        val = val.slice(i)
        if (useParent) {
          let l = (ownPath.length - 1) - i
          let p = obs
          while (l > -1) {
            p = p._cLevel === 1 ? p.__c : p._parent
            l--
          }
          return p.get(val, {})
        } else {
          return target.get(val, {})
        }
      }
    } else {
      target = target.get(segment)
    }
  }
  return target
}

function isParent (arr, val, len, target) {
  for (let i = 0; i < len; i++) {
    if (arr[i] != val[i]) { // eslint-disable-line
      // really hard ot recreate but does happen
      return
    }
  }
  return true
}
