'use strict'
<<<<<<< HEAD
=======
// lets try to get rid of this one
const Base = require('../')
const includes = require('lodash.includes')
const CIRCULAR = '[Circular]'

function plain (filter, parseValue, circularGuard) {
  if (!circularGuard) {
    circularGuard = [this]
  }
  var input = this.__input
  if (input !== void 0) {
    if (input instanceof Base) {
      return 'reference [' + input.path + ']'
    } else {
      return parseValue
        ? this.val
        : input
    }
  }
  var obj = {}
  this.each(function (property, key) {
    if (includes(circularGuard, property)) {
      obj[key] = CIRCULAR
    } else {
      circularGuard.push(property)
      obj[key] = property instanceof Base
        ? plainBase(property, filter, parseValue, circularGuard)
        : plainNonBase(property, filter, parseValue, circularGuard)
    }
  }, filter)
  return obj
}

>>>>>>> master
exports.define = {
  /**
   * Convert a `Base` object into a plain JSON object
   * @memberOf Base#
   * @param {function} filter function
   * @return {object} Caller converted to standard JSON
   */
  plain () {
    console.warn('depricated use serialize instead')
    return this.serialize.apply(this, arguments)
  }
}
