'use strict'

function mapFast (target) {
  var checks
  var prevmap = target._mapPropKeys
  var propkeys = {}
  var newprops = []

  if (!prevmap) {
    checks = ''
    newprops = []
    for (let prop in target._properties) {
      if (prop !== '_propertiesBind') {
        newprops.push(prop)
      }
    }
  } else {
    checks = prevmap.___propcache___ + ' || '
    for (let prop in target._properties) {
      propkeys[prop] = true
      if (target._properties[prop]) {
        if (prop !== '_propertiesBind' && !(prop in prevmap)) {
          newprops.push(prop)
        }
      } else if (prevmap[prop]) {
        // console.error('dangerous! different keys', prop)
        newprops = []
        for (let prop in target._properties) {
          if (prop !== '_propertiesBind') {
            newprops.push(prop)
          }
        }
        break;
      }
    }
  }

  const len = newprops.length
  if (len) {
    if (len > 1) {
      for (let i = 0; i < len - 1; i++) {
        checks += '\n  key === \'' + newprops[i] + '\' ||'
      }
    }
    checks += '\n  key === \'' + newprops[len - 1] + '\''
    propkeys.___propcache___ = checks
    var str = 'if(' + checks + '\n) { return key }'
    // seems dirty but is by far the fastest method to do this in v8
    // tried all alternative second runner is an array at 2.5x speed
    target._mapProperty = Function('key', str) // eslint-disable-line
    target._mapPropKeys = propkeys
  }
}

// module.exports = mapFast

// seems dirty but is by far the fastest method to do this in v8
// module.exports = function mapFastV (target, key, stamp) {
//   var checks = ''
//   for (var prop in target._properties) {
//     if (target._properties[prop] && prop !== '_propertiesBind') {
//       checks += '\n  key === \'' + prop + '\' ||'
//     }
//   }
//   checks = checks.slice(0, -2)
//   var str = 'if(' + checks + '\n) { return key }'
//   target._mapProperty = Function('key', str) // eslint-disable-line
// }

module.exports = function (target) {
  target._mapProperty = null
  target._mapTarget = target
}