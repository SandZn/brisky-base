'use strict'
/**
 * @property parent
 * Parent of base object
 * gets the context-resolved parent of a base
 * @memberOf Base#
 * @type {base|undefined}
 * @todo think about set, is this stamp behaviour we want to support?
 */
exports.cParent = function () {
  var level = this._cLevel
  var parent
  if (level) {
    let context = this._c
    if (level === 1) {
      return context
    }
    parent = this._parent
    if (parent && !parent._c !== context) {
      parent._c = context
      parent._cLevel = level - 1
    }
  } else {
    parent = this._parent
    if (parent && parent._c) {
      parent.clearContext()
    }
  }
  return parent
}

exports.parent = {
  get () {
    return this.cParent()
  }
}
