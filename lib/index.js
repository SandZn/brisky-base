'use strict'
var define = Object.defineProperty
/**
 * @namespace Base
 * Constructor of Base
 * @class
 * @param  {*} val - set value of the base object
 * @param  {stamp} stamp - pass stamp, on base base constructor defaults to false
 * @param  {base} parent - parent object
 * @param  {string} key - key thats being set on a parent
 * @return {base}
 */
var Base = module.exports = function (val, stamp, parent, key, escape) {
  this.setParent(val, stamp, parent, key)
  if (val !== void 0) {
    this.set(val, stamp || false, true, escape)
  }
}

var proto = Base.prototype

/**
 * @function define
 * helper for Object.defineProperty on base classes
 * always sets configurable to true
 * @memberOf Base#
 * @param {...object} Defines each object on the base
 */
define(proto, 'define', {
  value: require('vigour-util/define'),
  configurable: true
})

// see base as one file, split up for convienience (not injectable)
proto.define(
  require('./constructor'),
  require('./set'),
  require('./set/value'),
  require('./set/property'),
  require('./set/property/add'),
  require('./set/property/internal'),
  require('./remove'),
  require('./context'),
  require('./context/util'),
  require('./context/parent'),
  require('./context/store'),
  require('./property'),
  require('./inject'),
  require('./bind'),
  require('./compute')
)

proto.define({ _base_version: { value: 1 } }) // add this everywhere!

proto.properties = require('./properties')

proto.inject(
  require('./method/each'),
  require('./method/toString'),
  require('./method/get'),
  require('./method/lookUp'),
  require('./method/serialize'),
  require('./method/sibling'),
  require('./method/path'),
  require('./method/root'),
  require('./uid'),
  require('./components'),
  require('./keys')
)

proto.components = { base: proto }
