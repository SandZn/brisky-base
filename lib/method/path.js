'use strict'
exports.define = {
  /**
   * @function path
   * gets the context path of a base
   * @memberOf Base#
   * @type {array}
   */
  path () {
    var path = []
    var parent = this
    while (parent && parent.key && !parent.rootoverride) {
      path.unshift(parent.key)
      if (parent._cLevel === 1) {
        parent = parent.__c
      } else {
        parent = parent._parent
      }
    }
    return path
  },
  /**
   * @function realPath
   * gets the non-context path of a base
   * @memberOf Base#
   * @type {array}
   */
  realPath (limit, memoize) {
    if (memoize && this._memoizedPath) {
      return this._memoizedPath
    } else {
      let path = []
      let parent = this
      while (parent && parent.key !== void 0 && parent !== limit && !parent.rootOverride) {
        path.unshift(parent.key)
        parent = parent._parent
      }
      if (memoize) {
        this._memoizedPath = path
      }
      return path
    }
  }
}
