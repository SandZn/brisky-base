/**
 * @function getRoot
 * gets the root of a base
 * @memberOf Base#
 * @type {base}
 */
exports.define = {
  getRoot (noOverride) {
    var parent = this
    var next = parent.cParent()
    while (next && (!next.rootOverride || noOverride)) { // eslint-disable-line
      parent = next
      next = parent.cParent()
    }
    return parent
  },
  root: {
    get () {
      return this._root || (this._root = this.getRoot())
    }
  }
}
