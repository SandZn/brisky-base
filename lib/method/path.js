'use strict'
exports.define = {
  /**
   * @function path
   * gets the context path of a base
   * @memberOf Base#
   * @type {array}
   * @todo make this faster use a function for parent
   * @todo perf tests (reverse at the end perhaps faster?)
   */
  path () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent.parent
    }
    return path
  },
  /**
   * @function realPath
   * gets the non-context path of a base
   * @memberOf Base#
   * @type {array}
   */
  realPath () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent._parent
    }
    return path
  },
  cachedPath (noOverride) {
    const path = []
    var parent = this
    if (this._cachedPath) {
      return this._cachedPath
    }
    while (parent && parent.key && (!parent.rootOverride || noOverride)) {
      path.unshift(parent.key)
      parent = parent._parent
    }
    this._cachedPath = path
    return path
  }
}
