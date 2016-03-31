'use strict'
const isObj = require('vigour-util/is/obj')

/**
 * @function setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for ._useVal|.useVal on val to overwrite default behaviour
 * @param  {Stamp} [stamp]
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, stamp, nocontext, property) {
  if (val && isObj(val) && val.type) {
    val = this.getType(val, stamp, key, void 0)
    if (property) {
      property.remove(false)
    }
  } else if (property) {
    if (property._parent !== this) {
      if (val === null) {
        return this.contextRemove(key, stamp)
      } else {
        const Constructor = property.getConstructor && property.getConstructor()
        if (!Constructor) {
          let path = this.path().join('.')
          path = path.length ? ' "' + path + '"' : ''
          throw new Error(`cannot set property "${key}", on "${this.type}" ${path}`)
        } else {
          this[key] = new Constructor(void 0, false, this, key)
          this[key].set(val, stamp, nocontext)
          return this[key]
        }
      }
    } else {
      property.set(val, stamp, nocontext)
      return
    }
  } else {
    this.addNewProperty(key, val, property, stamp)
    return this
  }
}
