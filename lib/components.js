'use strict'
var merge = require('lodash.merge')
var Base = require('./')
var isObj = require('vigour-util/is/obj')

function lookUpComponent (target, type, val, Constructor) {
  var result
  while (target && type) {
    if (target.components && target.components[type]) {
      result = target.components[type]
      if (isObj(result)) {
        let check = result.type && result.type !== type &&
          lookUpComponent(target, result.type || type, val, Constructor)
        if (check) {
          result = target.components[type] = new check.Constructor(result, false, target)
        } else {
          result = target.components[type] = new Constructor(result, false, target)
        }
      }
      return result
    }
    target = target._parent
  }
}

exports.define = {
  getType (val, stamp, key, nocontext) {
    var type = val.type
    if (!type) {
      return val
    }
    let result = lookUpComponent(this, type, val, this.ChildType || this.Child)
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
  /**
   * @property Constructor
   * @memberOf Base#
   * Overwrites Child
   * @param {*} val
   * if val is string tries to get this[val]
 */
  Child (val, stamp) {
    if (isObj(val)) {
      val = this.getType(val, stamp)
    }
    const type = typeof val
    if (type === 'string') {
      val = this[val]
    } else if (val && type !== 'function' && val.Constructor) {
      val = val.Constructor
    } else if (type === 'object') {
      if (this.hasOwnProperty('Child')) {
        // this is fast but dangerous (missing updates) TODO CLEAN UP
        this.Child.prototype.set(val, false)
        return
      }
      val = new this.Child(val, stamp, this).Constructor
    }
    if (val) {
      val.prototype._isChild = this
    }
    this.define({ Child: val })
  },
  components (val, stamp) {
    if (!this.components) {
      this.components = {}
    } else if (!this.hasOwnProperty('components')) {
      const old = this.components
      let n = {}
      for (let key in old) {
        n[key] = old[key]
      }
      this.components = n
    }
    if (val instanceof Array) {
      for (let i = 0, len = val.length; i < len; i++) {
        setComponent.call(this, val[i], stamp)
      }
    } else {
      setComponent.call(this, val, stamp)
    }
  }
}

exports.type = 'base'

function setComponent (val, stamp) {
  var comp = this.components
  for (let key in val) {
    if (val[key].type) {
      comp[key] = val[key]
    } else if (!comp[key]) {
      comp[key] = val[key]
    } else if (isObj(comp[key])) {
      merge(comp[key], val[key])
    } else if (comp[key] instanceof Base) {
      comp[key].inject(val[key], stamp)
    }
  }
}
