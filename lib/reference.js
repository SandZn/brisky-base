'use strict'
module.exports = function reference (obs, val, stamp) {
  const rootObj = obs.getRoot()
  const ownPath = obs.realPath(false, true)
  var target = rootObj
  var useParent
  if (val[1] === '.') {
    val = val.split('.')
    const path = obs.realPath()
    for (let i = 1, len = val.length; i < len; i++) {
      path.push(val[i])
    }
    val = path
  } else {
    val = val.split('.')
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
    let key
    // slow make faster later
    let match = segment.match(/\[(\-?\d*?)\]/)
    if (match) {
      key = match[1]
      segment = segment.slice(0, match.index)
    }

    if (!target[segment] || useParent) {
      if (ownPath[i] === val[i]) {
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
          target = p.get(val, {})
          console.log('when do you ever get hur?')
          if (key) {
            target = getKey(target, key)
          }
          return target
        } else {
          if (key) {
            keyError(target, key)
          }
          return target.get(val, {})
        }
      }
    } else {
      target = target[segment]
      if (key) {
        target = getKey(target, key)
      }
    }
  }
  return target
}

function getKey (target, key) {
  const keys = target.keys()
  var ret
  key = Number(key)
  if (key > -1) {
    if (keys[key] !== void 0) {
      ret = target[keys[key]]
    }
  } else {
    const calc = keys.length + key
    if (keys[calc] !== void 0) {
      ret = target[keys[calc]]
    }
  }
  if (!ret) {
    keyError(target, key)
  } else {
    return ret
  }
}

function keyError (target, key) {
  throw new Error(`reference notation - cant find key "[${key}]" in "${target.path().join('.')}"`)
}
