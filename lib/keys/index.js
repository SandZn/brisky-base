'use strict'
const filterTypes = require('./filters').types
const keys = require('./method')
const sort = require('./sort')
const addKey = require('./add')
const remove = require('./remove')
const removeKey = remove.key
const removeAllKeys = remove.all
const resolveKeys = require('./resolve')

exports.properties = {
  keyType: true,
  sortMethod: true,
  sort (val) {
    var needsUpdate
    if (val && typeof val === 'object') {
      if (val.exec) {
        needsUpdate = true
        this.sortMethod = val.exec
      }
      val = val.val
    }

    if (val !== this.sort || needsUpdate) {
      this.sort = val
      const keys = this._keys
      if (keys) {
        if (val === null) {
          delete keys._
        } else {
          this._keys._ = []
          sort(this, keys, val)
        }
      }
    }
  }
}

exports.sortMethod = function sort (a, b) {
  return a < b ? -1 : a > b ? 1 : 0
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
  removeAllKeys,
  resolveKeys
}
