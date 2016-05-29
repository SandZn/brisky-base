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
    const from = Object.getPrototypeOf(this)
    if (!from._instances) { from._instances = [] }
    from._instances.push(this)
  },
  removeFromInstances () {
    // try to speed this up
    const from = Object.getPrototypeOf(this)
    var instances = from._instances
    if (instances) {
      let length = instances.length
      for (let i = 0; i < length; i++) {
        if (instances[i] === this) {
          instances.splice(i, 1)
          break
        }
      }
    }
    instances = this._instances
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
