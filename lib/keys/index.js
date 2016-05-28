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
  sort (val) {
    if (val !== this.sort) {
      this.sort = val
      if (this._keys) {
        if (val === null) {
          console.log('REMOVE SORT')
        } else {
          this._keys._ = new Array(this._keys.length)
          sort(this, this._keys, val)
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
  addKey (key, target) {
    var keys = this._keys
    var copy
    if (!this._ownKeys) {
      copy = true
      keys = this._keys = keys ? keys.concat([ key ]) : [ key ]
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
    if ('sort' in this) {
      const sort = this.sort
      if (sort) {
        sortAdd(this, target, keys, sort)
      }
    }
    instances(this, target, this.addKey, keys, key)
    if (this._filters) {
      addFilters(this, key, copy)
    }
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
              if ('_' in keys) { keys._.splice(i, 1) }
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
            if ('_' in keys) { keys._.splice(i, 1) }
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
    if (!this._ownKeys) {
      this._ownKeys = true
    }
    this._filters = false
    this._keys = false
  }
}
