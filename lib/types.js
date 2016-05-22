'use strict'
var merge = require('lodash.merge')
var isObj = require('vigour-util/is/obj')

function lookUpType (target, type, val, Constructor) {
  var result
  while (target) {
    if (target.types && target.types[type]) {
      result = target.types[type]
      if (result && typeof result !== 'object') {
        result = target.types[type] = { val: result }
      }
      if (isObj(result)) {
        const inherits = result.type && result.type !== type &&
          lookUpType(target, result.type || type, val, Constructor)
        if (inherits) {
          result = target.types[type] = new inherits.Constructor(result, false, target)
        } else {
          result = target.types[type] = new Constructor(result, false, target)
        }
      }
      return result
    }
    target = target._parent
  }
}

exports.define = {
  getType (val, stamp, key, nocontext) {
    const type = val.type
    if (!type) {
      return val
    }
    let result = lookUpType(this, type, val, this.ChildType || this.Child)
    if (result) {
      let r = new result.Constructor(val, stamp, this, key)
      if (!r.noReference) {
        r.noReference = true
      }
      return r
    } else {
      console.log('cannot find type:', type)
    }
    return val
  }
}

exports.properties = {
  type: true,
  types (val, stamp) {
    if (!this.hasOwnProperty('types')) {
      const old = this.types
      let n = {}
      for (let key in old) {
        n[key] = old[key]
      }
      this.types = n
    }
    if (val instanceof Array) {
      for (let i = 0, len = val.length; i < len; i++) {
        setType.call(this, val[i], stamp)
      }
    } else {
      setType.call(this, val, stamp)
    }
  }
}

exports.type = 'base'

function setType (val, stamp) {
  const types = this.types
  var noObj
  for (let key in val) {
    if (val[key].type) {
      types[key] = val[key]
    } else if (!(key in types) || !types[key]) {
      types[key] = val[key]
    } else if (isObj(types[key]) || (noObj = typeof types[key] !== 'object')) {
      if (noObj) { types[key] = { val: types[key] } }
      merge(types[key], val[key])
    } else if ('isBase' in types[key]) {
      types[key].inject(val[key], stamp)
    }
  }
}
