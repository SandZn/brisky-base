'use strict'
exports.define = {
  key: {
    get () {
      return (this._c && this._cKey) || this._key
    },
    set (val) {
      this._key = val
    }
  }
}

exports.properties = {
  _cKey: true
}
