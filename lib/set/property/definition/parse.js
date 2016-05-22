'use strict'
var Base = require('../../../')

module.exports = function parse (property) {
  if (property && typeof property === 'object' && property.isBase) {
    if (property._Constructor || property === Base.prototype) {
      property = new property.Constructor().Constructor
    } else {
      property = property.Constructor
    }
  } else if (typeof property === 'function' && property.prototype) {
    if (property.prototype._Constructor || property === Base) {
      property = new property().Constructor // eslint-disable-line
    }
  }
  return property
}
