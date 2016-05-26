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
    const target = val[key]
    return target && target.isBase && target.keyType === field
  },
  keyTest (key) {
    return key !== 'val'
  },
  keysCheck (val, key) {
    if (key !== 'val') {
      let target
      target = val[key]
      if (
        target &&
        target.isBase &&
        !target.keyType
      ) {
        return target
      }
    }
  },
  keys (field, check) {
    // less options here
    var keys
    if (!check) {
      if (!field) {
        field = '_keys'
        check = this.keysCheck
        keys = this._keys
      } else {
        check = this.keysCheckField
        keys = this[field]
      }
    } else if (!field) {
      field = '_keys'
      keys = this._keys
    } else {
      keys = this[field]
    }

    if (!this._rawKeys) {
      this.generateRawKeys()
    }

    if (!keys && keys !== false) {
      let r = this._rawKeys
      keys = this[field] = []
      let ordered
      for (let i = 0, len = r.length; i < len; i++) {
        let key = r[i]
        let target = check(this, key, field)
        if (target) {
          if (!ordered && target.order) {
            ordered = true
          }
          keys.push(key)
        }
      }
      if (ordered) {
        // @todo: .sort is very slow fix this using a custom qsort
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
    // maybe raw keys can be removed less often
    // this._rawKeys = null
    // will never be cleared from here
    // integral system on add and remove!
    if (!target || !target.keyType) {
      this._keys = null
    } else {
      this[target.keyType] = null
    }
  },
  generateRawKeys () {
    // this will never be called from here
    if (!this._rawKeys) {
      const from = Object.getPrototypeOf(this)
      if (from && from.generateRawKeys) {
        if (!from._rawKeys) {
          from.generateRawKeys()
        }
        // filterKeys(Object.keys(this)).concat(from._rawKeys) //
        this._rawKeys = addAndFilterKeys(Object.keys(this), from, this).concat(from._rawKeys)
      } else {
        this._rawKeys = filterKeys(Object.keys(this))
      }
    }
  }
}

function filterKeys (keys) {
  var splice = false
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i][0] === '_') {
      splice = splice ? splice + 1 : 1
    } else if (splice !== false) {
      keys.splice(i - splice, splice)
      len -= splice
      i -= splice
      splice = false
    }
  }
  return keys
}

function addAndFilterKeys (keys, from, t) {
  var splice = false
  for (let i = 0, len = keys.length; i < len; i++) {
    if (keys[i][0] === '_') {
      splice = splice ? splice + 1 : 1
    } else if (keys[i] in from) {
      splice = splice ? splice + 1 : 1
    } else if (splice !== false) {
      keys.splice(i - splice, splice)
      len -= splice
      i -= splice
      splice = false
    }
  }
  return keys
}
