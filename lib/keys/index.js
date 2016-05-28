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

// method named resort?
// clean these functions up tmrw too much branching
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
        if (sort) {
          this._keys._ = keys._.concat()
        }
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
    if (sort) {
      sortAdd(this, target, keys, sort)
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
    } else {
      if (!keys) {
        keys = this._keys = false
        if (this._filters) {
          this._filters = false
        }
      } else {
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
