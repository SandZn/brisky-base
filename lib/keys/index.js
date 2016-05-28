'use strict'
const filters = require('./filters')
const addFilters = filters.add
const removeFilters = filters.remove
const createFilters = filters.create

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
  filterTypes (target, key, type) {
    target = target[key]
    return 'keyType' in target && target.keyType === type
  },
  addKey (key, target) {
    var keys = this._keys
    if (!this._ownKeys) {
      keys = this._keys = keys
        ? keys.concat([ key ])
        : [ key ]
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
    const instances = this._instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        let instance = instances[i]
        if (instance._keys !== keys && instance[key] === target) {
          instance.addKey(key, target)
        }
      }
    }
  },
  removeKey (key, target) {
    var keys = this._keys
    if (!this._ownKeys) {
      if (!keys) {
        keys = this._keys = false
        this._filters = false
      } else {
        // little bit different of course
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
    const instances = this._instances
    if (instances) {
      for (let i = 0, len = instances.length; i < len; i++) {
        let instance = instances[i]
        if (instance._keys !== keys && instance[key] === target) {
          instance.removeKey(key, target)
        }
      }
    }
  },
  removeAllKeys () {
    if (!this._ownKeys) {
      this._ownKeys = true
    }
    this._filters = false
    this._keys = false
    if (this._instances) {
      console.log('removeAllKeys -- keys update - this one is really really hard for instances')
    }
  },
  keys (type) {
    const keys = this._keys
    if (!keys) {
      return empty
    } else {
      if (type) {
        createFilters(this, type)
        if (!(type in this._filters)) {
          let filter = this.filterTypes // here you handle types
          let filtered = this._filters[type] = [] // dont make until you know
          for (let i = 0, len = keys.length; i < len; i++) {
            if (filter(this, keys[i], type)) {
              filtered.push(keys[i])
            }
          }
          return filtered
        } else {
          return this._filters[type]
        }
      } else if ('filter' in this) {
        createFilters(this, 'keys')
        if ('keys' in this._filters) {
          return this._filters.keys || empty
        } else {
          let filtered = this._filters.keys = []
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

// false can be inherited until its nessecary
