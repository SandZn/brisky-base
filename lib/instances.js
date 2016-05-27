'use strict'
exports.properties = {
  instances (val) {
    this._instances = val
  }
}

// does this really need to be a property?
exports.instances = false

// needs an overwrite for properties to remap inherited props
exports.define = {
  addToInstances () {
    const proto = Object.getPrototypeOf(this)
    if (!proto._instances) { proto._instances = [] }
    proto._instances.push(this)
  },
  removeFromInstances () {
    const proto = Object.getPrototypeOf(this)
    var instances = proto._i
    // proto instances
    if (instances) {
      let length = instances.length
      for (let i = 0; i < length; i++) {
        if (instances[i] === this) {
          // removes itself from instances
          instances.splice(i, 1)
          break
        }
      }
    }
    // own instances
    instances = this._i
    if (instances) {
      let length = instances.length
      for (let i = 0; i < length; i++) {
        instances[i].remove(false)
        i--
        length--
      }
    }
  }
}
