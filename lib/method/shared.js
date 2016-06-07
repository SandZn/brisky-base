'use strict'
var isObj = require('vigour-util/is/obj')

exports.returnFilter = function (options) {
  if (options !== void 0) {
    if (typeof options === 'function') {
      return options
    }
    if (options instanceof RegExp) {
      return function (subject) {
        return options.test(subject.compute())
      }
    } else if (isObj(options)) {
      if (options.constructor === Array) {
        var length = options.length
        return (subject) => {
          for (let i = length - 1; i >= 0; i--) {
            let value = options[i]
            if (subject === value || subject.val === value) {
              return true
            }
          }
        }
      }
    } else {
      return (subject) => subject === options || subject.val === options
    }
  }
}

exports.returnPath = function (path) {
  if (typeof path === 'string') {
    if (/[^\.]\[\-?\d*?\]/.test(path)) {
      path = path.replace(/(\[\-?\d*?\])/g, '.$1')
      if (path[0] === '.') {
        path = path.slice(1)
      }
    }
    return path.split('.')
  } else {
    return path
  }
}

function getPath (obj, path, length, filter, set, stamp) {
  var i = 0
  var result
  var prev = obj
  if (path[0] && path[0][0] === '[') {
    result = exports.getKey(obj, path[0].slice(1, -1))
  } else {
    result = path[0] in obj && obj[path[0]]
  }
  while (result) {
    if (typeof result === 'function' && path[i] !== 'Constructor') {
      result = result.call(prev)
    }
    prev = result
    if (++i === length) {
      if (filter === void 0 || filter(result, obj)) {
        return result
      }
    }
    obj = result
    if (path[i] && path[i][0] === '[') {
      result = exports.getKey(result, path[i].slice(1, -1))
    } else {
      result = result[path[i]]
    }
  }
  if (set !== void 0) {
    return createPath(obj, path.splice(i), length - i, set, stamp)
  }
}

function createPath (obj, path, length, set, stamp) {
  var setObj = {}
  var nextObj = setObj
  var i = 0
  var field
  for (;i < length - 1; i++) {
    field = path[i]
    if (field && field[0] === '[') {
      keyError(obj, field.slice(1, -1))
    }
    nextObj[field] = {}
    nextObj = nextObj[field]
  }
  if (set !== void 0) {
    if (path[i] && path[i][0] === '[') {
      keyError(obj, path[i].slice(1, -1))
    }
    nextObj[path[i]] = set
  }
  obj = obj.set(setObj, stamp) || obj
  return getPath(obj, path, length)
}

exports.createPath = createPath
exports.getPath = getPath

exports.getKey = function (target, key) {
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
  console.log(`key notation - cant find key "[${key}]" in "${target.path().join('.')}"`)
}
