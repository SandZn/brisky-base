'use strict'
const clear = require('./clear')
const defaultProperty = require('./default')
const baseProperty = require('./base')
const Base = require('../../../')
const injectBase = require('../../../inject/base')

module.exports = function property (target, key, val, props, stamp) {
  if (val === true) {
    clear(target, key, props, stamp)
    props[key] = defaultProperty
  } else if (val === null) {
    clear(target, key, props, stamp)
  } else if (typeof val === 'function') {
    clear(target, key, props, stamp)
    props[key] = val
  } else {
    if (typeof val === 'object' && val.isBase) {
      clear(target, key, props, stamp)
      if (val._Constructor || val === Base.prototype) {
        createInstance(val.Constructor, void 0, props, stamp, target, key)
      } else {
        props[key] = baseProperty(val, key)
      }
    } else if (key in props && props[key]) {
      if (
        !('base' in props[key]) ||
        (
          typeof val === 'object' &&
          ('type' in val && val.type !== props[key].base.type)
        )
      ) {
        clear(target, key, props, stamp)
        convertObjectToBase(target, key, val, props, stamp)
      } else {
        set(target, key, val, props, stamp)
      }
    } else {
      convertObjectToBase(target, key, val, props, stamp)
    }
  }
}

function convertObjectToBase (target, key, val, props, stamp) {
  if (val.type) {
    let res = target.getType(val, stamp, key)
    if (res && res.isBase) {
      createInstance(res.Constructor, val, props, stamp, target, key)
    } else {
      createInstance(target.Child, val, props, stamp, target, key)
    }
  } else {
    createInstance(target.Child, val, props, stamp, target, key)
  }
}

function createInstance (Constructor, val, props, stamp, target, key) {
  props[key] = baseProperty(new Constructor(val, stamp, target, key), key)
}

function set (target, key, val, props, stamp) {
  if (props[key].base._parent !== target) {
    const OldConstructor = props[key].base._Constructor
    createInstance(props[key].base.Constructor, val, props, stamp, target, key)
    if (
      key in target &&
      target[key] &&
      target[key] instanceof OldConstructor
    ) {
      // this mimics the behvaiour of a set on a property -- may exclude this with an option in define (reset: false)
      const prevTargetKey = target[key]
      target.setKeyInternal(
        key,
        new props[key].base.Constructor(val),
        false
      )
      const excludes = typeof val === 'object' ? Object.keys(val) : [ 'val' ]
      for (let i = 0, len = excludes.length; i < len; i++) {
        if (prevTargetKey.hasOwnProperty(excludes[i])) {
          excludes.splice(i, 1)
          len--
          i--
        }
      }
      target[key].set(val, stamp)
      injectBase(target[key], prevTargetKey, false, excludes)
    }
  } else {
    props[key].base.set(val, stamp)
  }
}

 // // ---------------------------------------
 //  if (typeof val !== 'object') {
 //    console.log('WARN **** WARN *** WARN PRIMITIVE IS DIFFERENT NOW ' + target.path().join('.') + ' prop:' + key)
 //  }
 //  // ---------------------------------------
