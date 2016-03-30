'use strict'
exports.define = {
  key: {
    get () {
      return (this.__c && this._cKey) || this._key
    },
    set (val) {
      this._key = val
    }
  }
}
