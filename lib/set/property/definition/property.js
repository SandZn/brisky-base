'use strict'
const clear = require('./clear')
const defaultProperty = require('./default')
const baseProperty = require('./base')
const Base = require('../../../')
const injectBase = require('../../../inject/base')
// this is complete now make it ultra clean
// module.exports = function

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
    // ---------------------------------------
    if (typeof val !== 'object') {
      console.log('WARN **** WARN *** WARN PRIMITIVE DIFFERENT NOW ' + target.path().join('.') + ' prop:' + key)
    }
    // ---------------------------------------
    if (typeof val === 'object' && val.isBase) {
      clear(target, key, props, stamp)
      if (val._Constructor || val === Base.prototype) {
        createConstructor(val.Constructor, void 0, props, stamp, target, key)
      } else {
        props[key] = baseProperty(val, key)
      }
    } else if (key in props && props[key]) {
      if (!('base' in props[key]) || val.type && val.type !== props[key].base.type) {
        clear(target, key, props, stamp)
        convertObjectToBase(target, key, val, props, stamp)
      } else {
        if (props[key].base._parent !== target) {
          const OldConstructor = props[key].base.Constructor
          createConstructor(props[key].base.Constructor, val, props, stamp, target, key)
          if (
            key in target &&
            target[key] &&
            target[key] instanceof OldConstructor
          ) {
            const prevTargetKey = target[key]
            target.setKeyInternal(
              key,
              new props[key].base.Constructor(val),
              false
            )
            injectBase(
              target[key],
              prevTargetKey,
              false,
              typeof val !== 'object' ? { val: true } : val
            )
            target[key].set(val, stamp)
          }
        } else {
          props[key].base.set(val, stamp)
        }
      }
    } else {
      convertObjectToBase(target, key, val, props, stamp)
    }
  }
}

function convertObjectToBase (target, key, val, props, stamp) {
  if (val.type) {
    clear(target, key, props, stamp)
    let res = target.getType(val, stamp, key)
    if (res && res.isBase) {
      createConstructor(res.Constructor, val, props, stamp, target, key)
    } else {
      createConstructor(target.Child, val, props, stamp, target, key)
    }
  } else {
    createConstructor(target.Child, val, props, stamp, target, key)
  }
}

function createConstructor (Constructor, val, props, stamp, target, key) {
  props[key] = baseProperty(new Constructor(val, stamp, target, key), key)
}
