'use strict'
const removeFilters = require('./filters').remove
const instances = require('./instances')

exports.all = function () {
  if (!this._ownKeys) {
    this._ownKeys = true
  }
  this._filters = false
  this._keys = false
}

exports.key = function (key, target) {
  var keys = this._keys
  if (!this._ownKeys) {
    if (!keys) {
      keys = this._keys = false
      this._filters = false
    } else {
      let len = this._keys.length
      if (len > 1) {
        if ('sort' in this && this.sort) {
          this._keys = keys.concat()
          this._keys._ = keys._.concat()
          keys = this._keys
        } else {
          keys = this._keys = this._keys.concat()
        }
        for (let i = 0; i < len; i++) {
          if (keys[i] === key) {
            keys.splice(i, 1)
            if ('_' in keys) { keys._.splice(i, 1) }
            break
          }
        }
        if (this._filters) {
          removeFilters(this, key, true)
        } else {
          this._filters = false
        }
      } else {
        this._keys = false
        this._filters = false
      }
    }
    this._ownKeys = true
  } else if (keys) {
    let len = keys.length
    if (len > 1) {
      for (let i = 0; i < len; i++) {
        if (keys[i] === key) {
          keys.splice(i, 1)
          if ('_' in keys) { keys._.splice(i, 1) }
          break
        }
      }
      if (this._filters) {
        removeFilters(this, key)
      }
    } else {
      this._filters = false
      this._keys = false
    }
  }
  instances(this, target, this.removeKey, keys, key)
}
