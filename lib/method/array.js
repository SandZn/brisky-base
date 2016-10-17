'use strict'

exports.define = {
  reduce (fn, start) {
    return this.keys().map(key => this[key]).reduce(fn, start)
  },
  map (fn, callee) {
    return this.keys().map((val, key, array) => fn(this[val], key, array))
  },
  // need to rename filter!

  // filter (fn) {
  //   console.log(this.keys(), this.keys().map(key => this[key]))
  //   return this.keys().map(key => this[key]).filter(fn)
  // },
  forEach (fn) {
    return this.keys().forEach(fn)
  }
}
