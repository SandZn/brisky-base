'use strict'
const injectBase = require('../../../inject/base')
const baseProperty = require('./base')
const keymap = require('./keymap')
const isMapped = keymap.isMapped
const removeFromKeyMap = keymap.remove
const move = require('./move')

module.exports = function set (target, key, val, props, stamp, realKey) {
  var prop = props[key]
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
    prop.base.set(val, stamp)
  }

  if (key === realKey && isMapped(props, key)) {
    prop = props[key] = baseProperty(prop.base, key)
    move(target, key, props, stamp, prop, key)
    removeFromKeyMap(props, key)
  }
  return prop
}
