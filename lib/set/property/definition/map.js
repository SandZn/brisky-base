'use strict'
// this is the play ground
module.exports = function map (key) {
    var checks = ''
    // nice indentation makes it run faster...
    for (var prop in this.properties) {
      if (this.properties[prop] && prop !== '_propertiesBind') {
        checks += '\n  key === \'' + prop + '\' ||'
      }
    }
    checks = checks.slice(0, -2)
    var str = 'if(' + checks + '\n) { return key }'
    this._mapProperty = Function('key', str) //eslint-disable-line
    console.log('add --> prop:', key)
  // need to know if its added or removed!
  // then create the hash maps
  // add the hashes to a store in here or on base/propertyCheckHAshes
  // or make a proeprty for it
  // todo --- context path
  // todo --- useVal + tests
  // type override -- allready has tests
  // awnser cachedpath quesiton
}
