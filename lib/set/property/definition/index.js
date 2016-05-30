'use strict'
const property = require('./property')
const define = require('./define')
const properties = require('./properties')

/**
 * @property properties
 * @memberOf Properties#
 * @param {*} val property val to be set
 * @param {stamp} stamp stamp passed on from current set
 */
properties.properties = function (val, stamp) {
  let props = this.properties
  if (!this.hasOwnProperty('properties')) {
    const Properties = function () {}
    Properties.prototype = props
    props = new Properties(this)
    this.define({ properties: { val: props } })
  }
  for (let key in val) {
    let definition = val[key]
    if (key === 'define') {
      define(this, definition, props, stamp)
    } else {
      let prop = key in props && props[key]
      props[key] = property(this, key, definition, props, stamp, prop) || null
    }
  }
  this._mapProperty = null
  this._mapTarget = this
}

exports.properties = { val: properties }
