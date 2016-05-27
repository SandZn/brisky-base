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
  // also make it possible in define to break out of "normal" definitions
  // really good for these kind of keys -- then props only has to be used for set properties not these private fields
  // can also do _ as a default exclude for props -- thats really really nice!
  // must be faster
  _keys: {
    val: false,
    writable: true // this is nasty make this reuslt in a "normal" writable, also rename value to val
  },
  _ownKeys: {
    val: true,
    writable: true
  },
  keysFilter (target, key) {

  },
  keysFilterType (target, key, type) {

  },
  addKey (key, target) {
    if (!this._ownKeys) {
      this._ownKeys = true
      this._keys = this._keys
        ? this._keys.concat([ key ])
        : [ key ]
    } else {
      if (!this._keys) {
        this._keys = [ key ]
      } else {
        this._keys.push(key)
      }
    }
  },
  removeKey (key, target) {
    if (!this._ownKeys) {
      this._ownKeys = true
      if (!this._keys) {
        this._keys = false
      } else {
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
      }
    } else {
      if (!this._keys) {
        this._keys = false
      } else {
        let len = this._keys.length
        for (let i = 0; i < len; i++) {
          if (this._keys[i] === key) {
            this._keys.splice(i, 1)
            break
          }
        }
      }
    }
  },
  removeAllKeys () {
    this._ownKeys = true
    this._keys = false
  },
  keys (type, filter) {
    if (type) {
      console.log('go filter --->', type, filter)
      if (!this._filteredKeys) {

      }

      if (!filter) {
        filter = this.keysFilterType
      }

    }
    // return filtered keys if keyCheck
    // is it not many times clearer to not do the false?
    return this._keys || empty
  }
}
