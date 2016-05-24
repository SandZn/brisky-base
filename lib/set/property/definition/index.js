'use strict'
const isObj = require('vigour-util/is/obj')
const property = require('./property')
const define = require('./define')
const properties = require('./properties')

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {stamp} stamp stamp passed on from current set
 */
properties.properties = function (val, stamp, resolve) {
  if (!isObj(val)) {
    throw new Error('.properties need to be set with an object')
  }
  let props = this.properties
  if (props.__attached__ !== this) {
    const Properties = function () {}
    Properties.prototype = props
    this.properties = props = new Properties(this)
    props.__attached__ = this
  }
  for (let key in val) {
    if (key === 'define') {
      define(this, val[key], props, stamp)
    } else {
      property(this, key, val[key], props, stamp)
    }
  }
  this._mapProperty = null
  this._mapTarget = this
}

module.exports = properties
