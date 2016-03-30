'use strict'
// const isObj = require('vigour-util/is/obj')

/**
 * @function setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for ._useVal|.useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Stamp} [stamp]
 * @param {nocontext} [boolean] dont resolveContext when true
 * @todo double check if a property set returning undefined is ok
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, stamp, nocontext, property) {
  // val == null just remove don do extra cgecks
  //, this[key]
  // var property = this['_' + key] || this[key]
  // var property = this[key]

  // dont do this isObj test double it sucks!

  // if (property && val && isObj(val) && val.type) {
    // add this on set not here
    // property.remove(false)
    // property = void 0
  // }
  if (property) {
    // here you can do the isObj check

    if (property._parent !== this) {
      if (val === null) {
        return this.contextRemove(key, stamp)
      } else {
        // dont use getter use internal (that constructor getter will use)
        const Constructor = property.getConstructor && property.getConstructor()
        if (!Constructor) {
          let path = this.path().join('.') // eslint-disable-line
          path = path.length ? ' "' + path + '"' : ''
          throw new Error(
            `cannot set property "${key}",
            on "${this.type}" ${path}
            it\'s reserved`
          )
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
    // if (val !== null) {

      // faster isObj check here?
      // if (val && isObj(val) && val.type) {
      //   val = this.getType(val, stamp, key, void 0)
      // }
    this.addNewProperty(key, val, property, stamp)
      // return this
    // } else {
      // return
    // }
  }
}
