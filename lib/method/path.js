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
  path () {
    const path = []
    var parent = this
    var c, clvl, prev, cp, clvlp, cprev
    while (parent && parent.key !== void 0) {
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
   * @todo optimize reuse (e.g. rootoverride)
   * @type {array}
   */
  realPath (limit) {
    // unify /w cachedpath?
    const path = []
    var parent = this
    while (parent && parent.key !== void 0 && parent !== limit) {
      path.unshift(parent.key)
      parent = parent._parent
    }
    return path
  },
  /**
   * @function cachedPath
   * gets the non-context path of a base and caches the return value
   * respects rootOverride
   * @memberOf Base#
   * @type {array}
   */
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
