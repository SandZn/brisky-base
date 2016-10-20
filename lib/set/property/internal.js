'use strict'
/**
 * @function setKeyInternal
 * @memberOf Base#
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for .noReference and .type on val to overwrite default behaviour
 * @param  {Stamp} [stamp]
 * @param {nocontext} [boolean] dont resolveContext when true
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, stamp, nocontext, property, params) {
  if (val && typeof val === 'object') {
    if (!val.isBase) {
      if (val.type) {
        val = this.getType(val, stamp, key, void 0, params)
        if (property) {
          property.remove(false)
        }
        if (val) {
          this.addNewProperty(key, val, stamp)
        }
        return this
      }
    } else if (
      val.noReference &&
      (!val._parent || val._parent === this)
    ) {
      this.addNewProperty(key, val, stamp)
      val._parent = this
      val.key = key
      return this
    }
  }
  if (property) {
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
          this[key].set(val, stamp, nocontext, params)
          return this[key]
        }
      }
    } else {
      property.set(val, stamp, nocontext)
      return
    }
  } else if (val === null) {
    this[key] = null
    this.resolveKeys()
    return
  } else {
    // console.log('hello', key, this.key, this.child === true, this.isEmitter)
    if (this.child === true) {
      this[key] = val
    } else {
      this.addNewProperty(key, new this.child(val, stamp, this, key, params), stamp) // eslint-disable-line
    }
    return this
  }
}
