'use strict'
const Base = require('./base')
module.exports = (val, stamp, parent, key, params) => {
  return new Base(val, stamp, parent, key, params)
}
