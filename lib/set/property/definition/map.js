'use strict'
module.exports = function map (target, key) {
  var checks = ''
  // nice indentation makes it run faster...
  for (var prop in target.properties) {
    if (target.properties[prop] && prop !== '_propertiesBind') {
      checks += '\n  key === \'' + prop + '\' ||'
    }
  }
  checks = checks.slice(0, -2)
  var str = 'if(' + checks + '\n) { return key }'
  target._mapProperty = Function('key', str) // eslint-disable-line
  console.log('add --> prop:', key)
}
