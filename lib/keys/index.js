'use strict'
exports.properties = {
  keyType: true,
  order (val, stamp, resolve, nocontext) {
    var prop = this.order // use contextGet method not getter
    if (!prop) {
      return this.setKeyInternal('order', val, stamp, nocontext)
    } else {
      let change = prop.set(val, stamp, nocontext)
      if (change && this._parent) {
        this._parent.clearKeys(this)
      }
      return change
    }
  }
}

exports.define = {
  keysCheckField (val, key, field) {
    var target = val[key]
    return target && target._base_version && target.keyType === field
  },
  keysCheck (val, key) {
    var target = val[key]
    return target &&
      target._base_version &&
      !target.keyType &&
      key !== 'listensOnBase' && // this needs to be done better!
      key !== 'listensOnAttach' &&
      key !== 'val'
  },
  keys (field, check) {
    if (!check) {
      check = (!field || field === '_keys') ? this.keysCheck : this.keysCheckField
    }
    if (!field) {
      field = '_keys'
    }
    var keys = this[field]
    // lets get rid of the hasOwnProperty check -- slow!
    if (!keys && keys !== false || !this.hasOwnProperty(field)) {
      keys = this[field] = []
      let ordered
      let target
      for (let key in this) {
        target = this[key]
        if (key[0] !== '_' && ((target = this[key]), target !== null) && check(this, key, field)) {
          if (!ordered && target.order) {
            ordered = true
          }
          keys.push(key)
        }
      }
      if (ordered) {
        // .sort is very slow fix this using a custom qsort
        keys.sort(this.sort.bind(this))
      } else if (!keys[0]) {
        keys = this[field] = false
      }
    }
    return keys
  },
  sort (a, b) {
    a = this[a].order || 0
    b = this[b].order || 0
    a = a.compute && a.compute() || a || 0
    b = b.compute && b.compute() || b || 0
    return a === b ? 0 : a < b ? -1 : 1
  },
  clearKeys (target) {
    if (!target || !target.keyType) {
      if (this._keys || this._keys === false) {
        this._keys = null
      }
    } else {
      let keys = this[target.keyType]
      if (keys || keys === false) {
        this[target.keyType] = null
      }
    }
  }
}
