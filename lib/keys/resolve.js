'use strict'
const copyFilters = require('./filters').copy
module.exports = function () {
  if (!this._ownKeys) {
    this._ownKeys = true
    if (!this._keys) {
      this._keys = false
      this._filters = false
    } else {
      this._keys = this._keys.concat()
      if (this._filters) {
        // needs test!
        this._filters = copyFilters(this._filters)
      } else {
        this._filters = false
      }
    }
  }
}
