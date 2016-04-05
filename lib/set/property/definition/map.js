'use strict'
module.exports = function map (target, key, stamp) {
  var checks = ''
  for (var prop in target._properties) {
    // nice indentation makes it run faster...
    if (target._properties[prop] && prop !== '_propertiesBind') {
      checks += '\n  key === \'' + prop + '\' ||'
    }
  }
  checks = checks.slice(0, -2)
  var str = 'if(' + checks + '\n) { return key }'
  // seems dirty but is by far the fastest method to do this in v8
  // console.log('----------------------->>>>>>>>>>>>>>>', key, target.type, stamp)
  target._mapProperty = Function('key', str) // eslint-disable-line
}
