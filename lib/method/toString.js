'use strict'
exports.define = {
  /**
   * @function inspect
   * @memberOf Base#
   * @return {string} debug function, default used by node.js console.log
   * @todo add uid and property indicator to inspected elements
   */
  inspect () {
    var type = this.type
    if (typeof type !== 'string') {
      type = this.key || 'customBase'
    }
    type = type[0].toUpperCase() + type.slice(1)
    return type + ' ' +
      (this.key ? this.key + ' ' : '') +
      JSON.stringify(this.serialize(), false, 2)
  },
  /**
   * @function toString
   * @memberOf Base#
   * @param  {fn} exclude. Optional function to exclude properties. It defaults
   * to ignore keys that starts with ' (e.g.:key)
   * @return {string} String of the object, including stringified functions
   */
  toString (filter) {
    if (this.val) {
      return this.compute()
    } else {
      return JSON.stringify(this.serialize(false, filter), false, 2)
    }
  }
}
