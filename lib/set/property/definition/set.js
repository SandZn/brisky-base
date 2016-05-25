'use strict'
const injectBase = require('../../../inject/base')
const baseProperty = require('./base')

module.exports = function set (target, key, val, props, stamp, mapKey) {
  console.log('DO', key, mapKey)
  if (key === null) {
    console.log('SPECIAL!')
  }
  var prop = props[key]
  // if (!mapKey) { mapKey = key }
  if (prop.base._parent !== target) {
    const OldConstructor = prop.base._Constructor
    prop = baseProperty(new prop.base.Constructor(val, stamp, target, key), key)
    if (
      OldConstructor &&
      key in target &&
      target[key] &&
      target[key] instanceof OldConstructor
    ) {
      const prevTargetKey = target[key]
      target.setKeyInternal(
        key,
        new prop.base.Constructor(val, stamp),
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
      injectBase(target[key], prevTargetKey, false, excludes)
    }
  } else {
    console.log('haha wrong')
    prop.base.set(val, stamp)
  }
  return prop
}
