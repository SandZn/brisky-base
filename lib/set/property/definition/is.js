'use strict'
var cnt = 0
// creating a function is arround 4x faster then the fastest alternative (array)
// may seem dirty but is a huge optmization for v8 for one of the hottest paths
function optimisePropertyMap (target, key) {
  var checks = ''
  for (let prop in target.properties) {
    if (
      target.properties[prop] &&
      prop !== '__attached__' &&
      prop !== '_overrides'
    ) {
      // "nice" formatting makes it faster
      checks += '\n  key === \'' + prop + '\' ||'
    }
  }
  checks = checks.slice(0, -2)
  var str = 'if(' + checks + '\n) { return key }'
  return (target._mapProperty = Function('key', str)) // eslint-disable-line
}

module.exports = function isProperty (key) {
  var m = '_mapProperty' in this && this._mapProperty
  if (!m) {
    if (cnt > 500) {
      m = optimisePropertyMap(this._mapTarget)
      this._mapTarget._mapTarget = null
      return m(key)
    } else {
      cnt++
      if (key in this.properties && this.properties[key]) {
        return key
      }
    }
  } else {
    return m(key)
  }
}
