'use strict'
exports.define = {
  /**
   * @function path
   * gets the context path of a base
   * @memberOf Base#
   * @type {array}
   * @todo perf tests
   * @todo respect rootoverride? add an option to cache (removes cachepath as api)
   * @todo cleanup context clearing -- dont even need cParent() anymore...
   */
  path (limit) {
    const path = []
    var parent = this
    var c, clvl, prev, cp, clvlp, cprev
    while (parent && parent.key !== void 0 && !parent.rootOverride) {
      path.unshift(parent.key)
      if (parent._cLevel > 1) {
        cprev = parent._parent
        if (cprev) {
          cp = cprev.__c || null
          clvlp = cprev._cLevel || null
        }
      }
      // should just not set it -- handle this manualy
      parent = parent.cParent()
      if (prev) {
        prev.__c = c
        prev._cLevel = clvl
        prev = null
        c = null
        clvl = null
      }
      if (cprev) {
        prev = cprev
        c = cp
        clvl = clvlp
        cp = null
        clvlp = null
        cprev = null
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
