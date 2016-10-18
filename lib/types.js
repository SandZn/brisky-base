'use strict'
const isObj = require('brisky-is-obj')
const OBJECT = 'object'

exports.define = {
  getType (val, stamp, key, nocontext, params, isChild) {
    const type = val.type
    if (!type) {
      return val
    }
    let result = lookUpType(this, type, val, this.childType || this.child)
    if (result) {
      if (result._typeNested) {
        result._typeNested = [ this, val, stamp, key, nocontext, params, isChild ]
        return void 0
      } else {
        let r = new result.Constructor(val, stamp, this, key, params)
        if (!r.noReference) { r.noReference = true }
        return r
      }
    } else {
      console.log('cannot find type:', type)
    }
    return val
  }
}

exports.properties = {
  type: true,
  _typeCnt: true,
  _typeNested: true,
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

function parseNested (cache, args) {
  const target = args[0]
  const val = args[1]
  const stamp = args[2]
  const key = args[3]
  const nocontext = args[4]
  const params = args[5]
  const isChild = args[6]
  if (isChild) {
    target.set({
      child: new cache.Constructor(val, stamp, target, key, nocontext, params)
    }, stamp, nocontext, params)
  } else {
    target.addNewProperty(key, new cache.Constructor(val, stamp, target, key, nocontext, params), stamp)
  }
}

function lookUpType (target, type, val, Constructor) {
  var result
  while (target) {
    if (target.types && target.types[type]) {
      result = target.types[type]
      if (result && typeof result !== OBJECT) {
        result = target.types[type] = { val: result }
      }
      if (isObj(result)) {
        const inherits = result.type && result.type !== type &&
          lookUpType(target, result.type || type, val, Constructor)
        if (inherits) {
          result = target.types[type] = new inherits.Constructor(result, false, target)
        } else {
          if ((!result._typeCnt)) {
            result._typeCnt = 1
          } else {
            result._typeCnt++
          }
          if (result._typeCnt < 2) {
            const cache = target.types[type] = result._typeCache || new Constructor(result, false, target)
            if (result._typeNested) {
              parseNested(cache, result._typeNested)
            }
            delete result._typeCnt
            delete result._typeNested
            Object.defineProperty(result, '_typeCache', { value: cache })
            result = cache
          } else {
            result._typeNested = true
            return result
          }
        }
      }
      result.type = type
      return result
    }
    target = target._parent
  }
}

function setType (val, stamp) {
  const types = this.types
  var noObj
  for (let key in val) {
    if (val[key].type) {
      types[key] = val[key]
    } else if (!(key in types) || !types[key]) {
      types[key] = val[key]
    } else if (isObj(types[key]) || (noObj = typeof types[key] !== OBJECT)) {
      if (noObj) { types[key] = { val: types[key] } }
      merge(types[key], val[key])
    } else if ('isBase' in types[key]) {
      types[key].inject(val[key], stamp)
    }
  }
}

function merge (a, b) {
  for (let i in b) {
    if (a[i] && typeof a[i] === OBJECT && b[i] && typeof b[i] === OBJECT) {
      merge(a[i], b[i])
    } else {
      a[i] = b[i]
    }
  }
}
