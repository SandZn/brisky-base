/**
 * @function getRoot
 * gets the root of a base
 * @memberOf Base#
 * @type {base}
 */
 // make this faster (use the parent function)
 // also try to make a 'syncRoot'
exports.define = {
  getRoot (noOverride) {
    var parent = this
    var next = parent.parent
    while (next && (!next.rootOverride || noOverride)) { // eslint-disable-line
      parent = next
      next = parent.parent
    }
    return parent
  },
  root: {
    get () {
      // add a caching mechanism
      return this.getRoot()
    }
  }
}
