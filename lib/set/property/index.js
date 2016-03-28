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
 * @param  {Event} [event]
 *   adds emiters to event if event is defined
 *   when false event emiters are not added
 * @param {nocontext} [boolean] dont resolveContext when true
 * @todo double check if a property set returning undefined is ok
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, property, event, nocontext, escape) {
  // if (property && val && isPlainObj(val) && val.type) {
  //   property.remove(false)
  //   property = void 0
  // }

  if (property) {
    if (property._parent !== this) {
      if (val === null) {
        return this.contextRemove(key, event)
      } else {
        let Constructor = property.Constructor
        if (escape && !Constructor) {
          if (typeof escape === 'string') {
            key = escape + key
          } else {
            key = 'escaped_' + key
          }
          this.setKeyInternal(key, val, this[key], event, nocontext, escape)
        } else if (Constructor === false) {
          property.set(val, event, void 0, escape)
        } else if (!Constructor) {
          let path = this.path
          throw new Error(
            'cannot set property "' + key +
            '", on "' + this.type + '"' +
            (path.length ? ' "' + this.path + '"' : '') +
            ' it\'s reserved'
          )
        } else {
          this[key] = new Constructor(void 0, false, this, key, escape)
          this[key].set(val, event, nocontext, escape)
          return this[key]
        }
      }
    } else {
      property.set(val, event, nocontext, escape)
      return
    }
  } else {
    if (val !== null) {
      if (val && isPlainObj(val) && val.type) {
        val = this.getType(val, event, key, void 0, escape)
      }
      // this.addNewProperty(key, val, property, event, escape)
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
 * @param  {Event} [event] Current event
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
const match = /\:([a-z\d]+)$/i
exports.mapProperty = function (key, val, event, nocontext, escape) {
  let result = typeof key === 'string' && key.match(match)
  return result && result[1]
}

exports.setKey = function (key, val, event, nocontext, escape) {
  var type = key

  // if (
  //   typeof val === 'string' &&
  //   val[0] === '$' &&
  //   (val[1] === '/' || (val[1] === '.' && val[2] === '/'))
  // ) {
  //   val = val.split('/')
  // }

  // if (typeof val === 'object' && val) {
  //   if (
  //     val instanceof Array && (val[0] === '$' || val[0] === '$.') ||
  //     val.val && val.val instanceof Array
  //   ) {
  //     if (val.val) {
  //       val.val = parseref(this, val.val)
  //     } else {
  //       val = parseref(this, val)
  //     }
  //   }
  // }

  // if (escape) {
  //   // check if regexp is faster here
  //   if (key === 'parent' || key === 'path' || key === 'properties') {
  //     if (typeof escape === 'string') {
  //       key = escape + key
  //     } else {
  //       key = 'escaped_' + key
  //     }
  //   }
  // } else

  if (
    this.properties[key]// ||
    // (
      // (type = this.mapProperty(key, val, event, nocontext, escape)) &&
      // this.properties[type]
    // )
  ) {
    // have to handle type here as well if prop is contructor thing
    // return this.properties[type].call(this, val, event, nocontext, key, escape)
  }
  // return this.setKeyInternal(key, val, this[key], event, nocontext, escape)
}
