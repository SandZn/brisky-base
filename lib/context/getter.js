'use strict'
/**
 * @function createContextGetter
 * @memberOf Base#
 * @param  {string} key - Key to create the context getter for
 */
module.exports = function (key) {
  const value = this.contextCandidate(this[key])
  if (value) {
    let privateKey = '_' + key
    let keys = value._keys
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        value.createContextGetter(keys[i])
      }
    }
    if (!(privateKey in this)) {
      this[privateKey] = value
      Object.defineProperty(this, key, {
        get () {
          const value = this[privateKey]
          if (value) {
            if (!this.hasOwnProperty(privateKey)) {
              value.__c = this
              value._cLevel = 1
            } else if (this.__c) {
              value._cLevel = this._cLevel + 1
              value.__c = this.__c
            } else {
              value.clearContext()
            }
          }
          return value
        },
        set (val) {
          // can handle null here
          this[privateKey] = val
        },
        configurable: true
      })
    }
  }
}
