'use strict'
const isPlainObj = require('vigour-util/is/plainobj')
const parseref = require('../../parseref')

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
exports.setKeyInternal = function (key, val, property, stamp, nocontext) {
  if (property && val && isPlainObj(val) && val.type) {
    property.remove(false)
    property = void 0
  }
  if (property) {
    if (property._parent !== this) {
      if (val === null) {
        return this.contextRemove(key, stamp)
      } else {
        const Constructor = property.Constructor
        if (Constructor === false) {
          property.set(val, stamp, void 0)
        } else if (!Constructor) {
          let path = this.path() // eslint-disable-line
          path = path.length ? ' "' + path + '"' : ''
          throw new Error(
            `cannot set property "$(key)",
            on "$(this.type)"$(path)
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
    if (val !== null) {
      if (val && isPlainObj(val) && val.type) {
        val = this.getType(val, stamp, key, void 0)
      }
      this.addNewProperty(key, val, property, stamp)
      return this
    } else {
      return
    }
  }
}

/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Stamp} [stamp] Current event
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
const match = /\:([a-z\d]+)$/i
// let result = typeof key === 'string' && key.match(match)
// return result && result[1]

// what about if you want : you write it yourself in here
exports.property = function (key, val, stamp, nocontext) {
  if (key in this._) {
    return key
  }
}

const reference = /^\$(\/|\.\/)/
// fastest is using the ._ in trick -- no :bla -- can we avoid it? maybe only for elements?
// its rly fucking slow

/*

  if (this._re.test(key)) {
    // call method then that method will be overwritten when you start mapping the props yourself
    console.log('prop:', key, this._re)
    // type mapping
    return this._properties[key].call(this, val, stamp, nocontext, key)
  }

*/
exports.setKey = function (key, val, stamp, nocontext) {
  var prop = this.property(key, val, stamp, nocontext)
  if (prop) {
    return this._properties[prop].call(this, val, stamp, nocontext, prop)
  } else {
    // return this.setKeyInternal(key, val, this[key], stamp, nocontext)
  }
}

// exports.setKey = function (key, val, stamp, nocontext) {
//   var type = key
//   // if (
//   //   typeof val === 'string' &&
//   //   reference.test(val)
//   // ) {
//   //   val = parseref(this, val)
//   // } else if (val && typeof val === 'object') {
//   //   if (
//   //     val instanceof Array && (val[0] === '$' || val[0] === '$.') ||
//   //     val.val && val.val instanceof Array
//   //   ) {
//   //     if (val.val) {
//   //       let newVal = {}
//   //       // faster way to copy
//   //       for (let key in val) {
//   //         newVal[key] = val[key]
//   //       }
//   //       newVal.val = parseref(this, val.val)
//   //       val = newVal
//   //     } else {
//   //       val = parseref(this, val)
//   //     }
//   //   }
//   // }

//   if (
//     this._PRE.test(key)
//     // this._properties[key] // have to speed up this lookup its extremely slow!
//     // ||
//     // (
//     //   (type = this.mapProperty(key, val, stamp, nocontext)) &&
//     //   this.properties[type]
//     // )
//   ) {
//     console.log(key, this._PRE)
//     return this._properties[type].call(this, val, stamp, nocontext, key)
//   }
//   // return this.setKeyInternal(key, val, this[key], stamp, nocontext)
// }
