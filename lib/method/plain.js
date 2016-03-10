'use strict'
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
