'use strict'
const empty = []

exports.properties = { keyType: true }

// missing things
// 1 - field -- field is onyl a filter
// 2 - normal keys -- need to have a filter as well
// 3 do we update th eiflter allwyas on add rmeove
// 4 yes defintly
// remove false notation make it just length 1

exports.define = {
  _keys: {
    val: false,
    writable: true // writable will now just ignore defining a proeprty (its useless)
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
    if (!this._ownKeys) {
      // even better everywhere we have this own keys piece of info
      this._keys = this._keys
        ? this._keys.concat([ key ])
        : [ key ]
      if (this._filteredKeys) {
        addToFilterStore(this, key, true)
      }
      this._ownKeys = true
    } else {
      if (!this._keys) {
        this._keys = [ key ]
      } else {
        this._keys.push(key)
      }
      if (this._filteredKeys) {
        addToFilterStore(this, key)
      }
    }
  },
  removeKey (key, target) {
    if (!this._ownKeys) {
      // even better everywhjere where we have htis own keys piece of info

      if (!this._keys) {
        this._keys = false
        this._filteredKeys = false
      } else {
        // little bit different of course
        let len = this._keys.length
        if (len === 1) {
          this._keys = this._keys.concat()
          for (let i = 0; i < len; i++) {
            if (this._keys[i] === key) {
              this._keys.splice(i, 1)
              break
            }
          }
        }
        if (this._filteredKeys) {
          removeFromFilterStore(this, key, true)
        }
      }
      this._ownKeys = true
    } else {
      if (!this._keys) {
        this._keys = false
        if (this._filteredKeys) {
          this._filteredKeys = false
        }
      } else {
        let len = this._keys.length
        for (let i = 0; i < len; i++) {
          if (this._keys[i] === key) {
            this._keys.splice(i, 1)
            break
          }
        }
        if (this._filteredKeys) {
          removeFromFilterStore(this, key)
        }
      }
    }
  },
  removeAllKeys () {
    this._ownKeys = true
    if (this._filteredKeys) {
      this._filteredKeys = false
    }
    this._keys = false
  },
  keys (type) {
    const keys = this._keys
    if (!keys) {
      return empty
    } else {
      if (type) {
        createFilterStore(this, type)
        if (!(type in this._filteredKeys)) {
          let filter = this.filterTypes // here you handle types
          let filtered = this._filteredKeys[type] = [] // dont make until you know
          for (let i = 0, len = keys.length; i < len; i++) {
            if (filter(this, keys[i], type)) {
              filtered.push(keys[i])
            }
          }
          return filtered
        } else {
          return this._filteredKeys[type]
        }
      } else if ('filter' in this) {
        createFilterStore(this, 'keys')
        if ('keys' in this._filteredKeys) {
          return this._filteredKeys.keys || empty
        } else {
          let filtered = this._filteredKeys.keys = []
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

function createFilterStore (target) {
  if (!target._filteredKeys) {
    target._filteredKeys = {}
  }
}

function addToFilterStore (target, key, createOwn) {

}

function removeFromFilterStore (target, key, createOwn) {

}

// false can be inherited until its nessecary
