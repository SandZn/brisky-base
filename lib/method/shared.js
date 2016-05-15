'use strict'
var isObj = require('vigour-util/is/obj')
var createPath
var getPath

exports.createPath = createPath = function (obj, path, length, set, stamp) {
  var setObj = {}
  var nextObj = setObj
  var i = 0
  var field
  for (;i < length - 1; i++) {
    field = path[i]
    nextObj[field] = {}
    nextObj = nextObj[field]
  }
  if (set !== void 0) {
    nextObj[path[i]] = set
  }
  obj = obj.set(setObj, stamp) || obj
  return getPath(obj, path, length)
}

exports.getPath = getPath = function (obj, path, length, filter, set, stamp) {
  var i = 0
  var result = path[0] in obj && obj[path[0]]
  while (result) {
    if (++i === length) {
      if (filter === void 0 || filter(result, obj)) {
        return result
      }
    }
    obj = result
    result = result[path[i]]
  }
  if (set !== void 0) {
    return createPath(obj, path.splice(i), length - i, set, stamp)
  }
}

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
  return typeof path === 'string' ? path.split('.') : path
}
