'use strict'
const deepAssign = require('deep-assign')
const isObj = require('brisky-is-obj')

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
          const cache = target.types[type] =
            ('_typeCache' in result && result._typeCache) ||
            new Constructor(result, false, target)
          Object.defineProperty(result, '_typeCache', { value: cache })
          result = cache
        }
      }
      return result
    }
    target = target._parent
  }
}

exports.define = {
  getType (val, stamp, key, nocontext, params) {
    const type = val.type
    if (!type) {
      return val
    }
    let result = lookUpType(this, type, val, this.childType || this.child)
    if (result) {
      let r = new result.Constructor(val, stamp, this, key, params)
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
      // need to use own merge!
      deepAssign(types[key], val[key])
    } else if ('isBase' in types[key]) {
      types[key].inject(val[key], stamp)
    }
  }
}
