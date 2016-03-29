'use strict'
const parseref = require('../../parseref')

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

// Array.prototype.includes

// let result = typeof key === 'string' && key.match(match)
// return result && result[1]
// what about if you want : you write it yourself in here
// if you evet want : fast it important to add it though else you get double (using the weird trick)
// dont every evey want to do match for each key allways bad

// this is what we want
exports.property = function (key, val, stamp, nocontext) {
  if (
    key === 'define' ||
    key === 'properties' ||
    key === 'inject' ||
    key === 'type' ||
    key === 'val'
  ) {
    return key
  }
}

// _pstr
exports.property = function (key, val, stamp, resolve, nocontext) {
  if (this._re.test(key)) {
    return key
  }
}

// exports.property = function (key, val, stamp, nocontext) {
//   if (key in this._properties) {
//     return key
//   }
// }

exports.property = function (key, val, stamp, resolve, nocontext) {
  return this._matchPropertyKeys(key)
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
exports.setKey = function (key, val, stamp, resolve, nocontext) {
  var prop = this.property(key, val, stamp, resolve, nocontext)
  // again use one way dont do and array and string -- my preference is just string

  // we will not do array anymore -- choose one and stick with it
  // or maybe remove string -- ask yuz tmrw
  if (
    typeof val === 'string' &&
    reference.test(val)
  ) {
    val = parseref(this, val)
  } else if (val && typeof val === 'object') {
    if (
      val instanceof Array && (val[0] === '$' || val[0] === '$.') ||
      val.val && val.val instanceof Array
    ) {
      if (val.val) {
        let newVal = {}
        // faster way to copy
        for (let key in val) {
          newVal[key] = val[key]
        }
        newVal.val = parseref(this, val.val)
        val = newVal
      } else {
        val = parseref(this, val)
      }
    }
  }

  if (prop) {
    return this._properties[prop].call(this, val, stamp, resolve, nocontext, prop)
  } else {
    // bit of a waster that we get resolvecontext here as well...
    return this.setKeyInternal(key, val, stamp, nocontext, this[key])
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
