'use strict'
const filterTypes = require('./filters').types
const keys = require('./method')
const sort = require('./sort')
const addKey = require('./add')
const remove = require('./remove')
const removeKey = remove.key
const removeAllKeys = remove.all

exports.properties = {
  keyType: true,
  sort (val) {
    if (val !== this.sort) {
      this.sort = val
      const keys = this._keys
      if (keys) {
        if (val === null) {
          console.log('REMOVE SORT NOT HANDLED YET')
          delete keys._
        } else {
          this._keys._ = new Array(keys.length)
          sort(this, keys, val)
        }
      }
    }
  }
}

exports.define = {
  _keys: {
    val: false,
    writable: true
  },
  _ownKeys: {
    val: true,
    writable: true
  },
  filterTypes,
  keys,
  addKey,
  removeKey,
  removeAllKeys
}
