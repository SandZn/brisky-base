'use strict'
const addFilters = require('./filters').add
const sortAdd = require('./sort/add')
const instances = require('./instances')

module.exports = function (key, target) {
  var sort
  if ('sort' in this) {
    sort = this.sort
  }
  var keys = this._keys
  var copy
  if (!this._ownKeys) {
    copy = true
    if (keys) {
      this._keys = keys.concat([ key ])
      if (sort) { this._keys._ = keys._.concat() }
      keys = this._keys
    } else {
      keys = this._keys = [ key ]
    }
    if (!this._filters) {
      this._filters = false
    }
    this._ownKeys = true
  } else {
    if (!keys) {
      keys = this._keys = [ key ]
    } else {
      keys.push(key)
    }
  }
  if (sort) { sortAdd(this, target, keys, sort) }
  instances(this, target, this.addKey, keys, key)
  if (this._filters) {
    addFilters(this, key, copy)
  }
}
