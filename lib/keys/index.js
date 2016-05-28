'use strict'
const filters = require('./filters')
const instances = require('./instances')
const keys = require('./method')
const addFilters = filters.add
const removeFilters = filters.remove
const filterTypes = filters.types
const sort = require('./sort')
const sortAdd = sort.add

exports.properties = {
  keyType: true,
  order: true, // make this a key
  ordered: true
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
  addKey (key, target) {
    var keys = this._keys
    if (!this._ownKeys) {
      // order will add complications here -- maybe use a filter when you use order?
      keys = this._keys = keys ? keys.concat([ key ]) : [ key ]
      if (this._filters) {
        addFilters(this, key, true)
      } else {
        this._filters = false
      }
      this._ownKeys = true
    } else {
      if (!keys) {
        keys = this._keys = [ key ]
      } else {
        keys.push(key)
      }
      if (this._filters) {
        addFilters(this, key)
      }
    }
    // reverse qs
    if (this.ordered) {
      sortAdd(this, target, keys)
    }
    instances(this, target, this.addKey, keys, key)
  },
  removeKey (key, target) {
    var keys = this._keys
    if (!this._ownKeys) {
      if (!keys) {
        keys = this._keys = false
        this._filters = false
      } else {
        let len = this._keys.length
        if (len === 1) {
          keys = this._keys = this._keys.concat()
          for (let i = 0; i < len; i++) {
            if (keys[i] === key) {
              keys.splice(i, 1)
              break
            }
          }
        }
        if (this._filters) {
          removeFilters(this, key, true)
        } else {
          this._filters = false
        }
      }
      this._ownKeys = true
    } else {
      if (!keys) {
        keys = this._keys = false
        if (this._filters) {
          this._filters = false
        }
      } else {
        let len = keys.length
        for (let i = 0; i < len; i++) {
          if (keys[i] === key) {
            keys.splice(i, 1)
            break
          }
        }
        if (this._filters) {
          removeFilters(this, key)
        }
      }
    }
    instances(this, target, this.removeKey, keys, key)
  },
  removeAllKeys () {
    // removeAllKeys will not update instances
    if (!this._ownKeys) {
      this._ownKeys = true
    }
    this._filters = false
    this._keys = false
  }
}
