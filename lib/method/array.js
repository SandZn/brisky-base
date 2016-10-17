'use strict'
// make fast filter and reduce
exports.define = {
  reduce (fn, start) {
    return this.keys().map(key => this[key]).reduce(fn, start)
  },
  map (fn, callee) {
    return this.keys().map((val, key, array) => fn(this[val], key, array))
  },
  filter (fn) {
    return this.keys().map(key => this[key]).filter(fn)
  },
  forEach (fn) {
    return this.each((p, key) => { fn(p, key, this) })
  }
}
