'use strict'
exports.define = {
  /**
   * @function path
   * gets the context path of a base
   * @memberOf Base#
   * @type {array}
   */
  path () {
    const path = []
    var parent = this
    var skip
    while (parent && (parent.key || parent.__c) && !parent.rootoverride) {
      path.unshift(parent.key)
      let level = parent._cLevel
      if (level === 1) {
        parent = parent.__c
      } else {
        if (level && parent._parent.__c !== parent.__c) {
          // repair incorrect context
          parent._parent.__c = parent.__c
          parent._parent._cLevel = level - 1
        }
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
      const path = []
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
