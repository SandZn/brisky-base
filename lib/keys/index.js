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
      this._keys = this._keys
        ? this._keys.concat([ key ])
        : [ key ]
      if (this._filteredKeys) {
        addToFilterStore(this, key, true)
      } else {
        this._filteredKeys = false
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
    if (this._i) {
      for (let i in this._i) {
        let instance = this._i[i]
        if (instance._keys !== this._keys && instance[key] === target) {
          console.log('THIS IS IT! INSTANCE PARTY', instance)
          instance.addKey(key, target)
        }
      }
      console.log('instance time!', this._i.length)
    }
  },
  removeKey (key, target) {
    if (!this._ownKeys) {
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
        } else {
          this._filteredKeys = false
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
    if (this._i) {
      for (let i in this._i) {
        let instance = this._i[i]
        if (instance._keys !== this._keys && instance[key] === target) {
          console.log('THIS IS IT! INSTANCE REMOVEVAL PARTY', instance)
          instance.removeKey(key, target)
        }
      }
      console.log('instance time!', this._i.length)
    }
  },
  removeAllKeys () {
    if (!this._ownKeys) {
      this._ownKeys = true
    }
    this._filteredKeys = false
    this._keys = false

    console.log('this one is really really hard for instances')
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
  // need to take createown into account
  // createown allways!
  const filtered = target._filteredKeys
  const type = target[key].keyType
  if (filtered[type]) {
    filtered[type].push(key)
  }
}

function removeFromFilterStore (target, key, createOwn) {
  // createown allways!
  const filtered = target._filteredKeys
  const type = target[key].keyType
  if (filtered[type]) {
    if (filtered[type].length === 1) {
      filtered[type] = false
    } else {
      for (let i = 0, len = filtered[type].length; i < len; i++) {
        if (filtered[type][i] === key) {
          filtered[type].splice(i, 1)
          break
        }
      }
    }
  }
}

// false can be inherited until its nessecary
