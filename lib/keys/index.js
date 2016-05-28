'use strict'
const filters = require('./filters')
const addFilters = filters.add
const removeFilters = filters.remove
const createFilters = filters.create
const filterTypes = filters.types
const empty = []

exports.properties = { keyType: true }

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
  addKey (key, target) {
    var keys = this._keys
    if (!this._ownKeys) {
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
    eachInstance(this, target, this.addKey, keys, key)
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
    eachInstance(this, target, this.removeKey, keys, key)
  },
  removeAllKeys () {
    // removeAllKeys will not update instances
    if (!this._ownKeys) {
      this._ownKeys = true
    }
    this._filters = false
    this._keys = false
  },
  keys (type) {
    const keys = this._keys
    if (!keys) {
      return empty
    } else {
      if (type) {
        createFilters(this, type)
        const filters = this._filters
        if (!(type in filters)) {
          let filter = this.filterTypes
          let filtered = filters[type] = []
          for (let i = 0, len = keys.length; i < len; i++) {
            if (filter(this, keys[i], type)) {
              filtered.push(keys[i])
            }
          }
          return filtered
        } else {
          return filters[type]
        }
      } else if ('filter' in this) {
        createFilters(this, 'keys')
        const filters = this._filters
        if ('keys' in filters) {
          return filters.keys || empty
        } else {
          let filtered = filters.keys = []
          for (let i = 0, len = keys.length; i < len; i++) {
            if (this.filter(keys[i])) {
              filtered.push(keys[i])
            }
          }
          return filtered
        }
      } else {
        return keys
      }
    }
  }
}

function eachInstance (parent, target, method, keys, key) {
  const instances = parent._instances
  if (instances) {
    for (let i = 0, len = instances.length; i < len; i++) {
      let instance = instances[i]
      if (instance._keys !== keys && instance[key] === target) {
        method.call(instance, key, target)
      }
    }
  }
}
