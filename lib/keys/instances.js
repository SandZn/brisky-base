'use strict'
module.exports = function eachInstance (parent, target, method, keys, key) {
  const instances = parent._instances
  if (instances) {
    for (let i = 0, len = instances.length; i < len; i++) {
      let instance = instances[i]
      if (instance._keys !== keys && instance[key] === target) {
        method.call(instance, key, target)
      }
    }
  }
}
