'use strict'
/**
 * @property path
 * gets the context-resolved path of a base
 * @memberOf Base#
 * @type {array}
 * @todo share more functionality
 * @todo perf tests (reverse at the end perhaps faster?)
 */

// make this faster use a function for parent
exports.path = {
  get: function () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent.parent
    }
    return path
  }
}

/**
 * @property _path
 * gets the real path of a base
 * @memberOf Base#
 * @type {array}
 */
exports._path = {
  get: function () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent._parent
    }
    return path
  }
}

/**
 * @function getRoot
 * gets the root of a base
 * @memberOf Base#
 * @type {base}
 */

 // make this faster (use the parent function)
 // also try to make a 'syncRoot'
exports.getRoot = function () {
  var parent = this
  var next = parent.parent
  while (next) {
    parent = next
    next = parent.parent
  }
  return parent
}
