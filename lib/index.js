'use strict'
const define = require('define-configurable')

/**
 * @namespace Base
 * Constructor of Base
 * @class
 * @param  {*} val - set value of the base object
 * @param  {stamp} stamp - pass stamp, on base base constructor defaults to false
 * @param  {base} parent - parent object
 * @param  {string} key - key thats being set on a parent
 * @todo double check if noresolve true is correct
 * @return {base}
 */
const Base = module.exports = function (val, stamp, parent, key, params) {
  this._Constructor = null
  this._ownKeys = null
  if (this.instances === false) {
    this.instances = null
  } else {
    this.instances = null
    this.addToInstances(stamp)
  }
  if (this._uid) { this._uid = null }
  this.setParent(val, stamp, parent, key)
  if (val !== void 0) {
    this.set(val, stamp, true, params, true)
  }
}

const base = Base.prototype
/**
 * @function define
 * helper for Object.defineProperty on base classes
 * always sets configurable to true
 * @memberOf Base#
 * @param {...object} Defines each object on the base
 */

// see base as one file, split up for convienience (not injectable)
define.call(
  base,
  {
    define,
    isBase: true
  },
  require('./constructor'),
  require('./set'),
  require('./set/value'),
  require('./set/property'),
  require('./set/property/move'),
  require('./set/property/add'),
  require('./set/property/internal'),
  require('./remove'),
  require('./context'),
  require('./context/util'),
  require('./context/parent'),
  require('./inject'),
  require('./compute'),
  require('./set/property/definition')
)

base.inject(
  require('./instances'),
  require('./method/each'),
  require('./method/toString'),
  require('./method/get'),
  require('./method/lookUp'),
  require('./method/serialize'),
  require('./method/path'),
  require('./method/root'),
  require('./method/array'),
  require('./uid'),
  require('./types'),
  require('./keys')
)
// ---------- non core --- maybe make this seperate modules -------
base.getConstructor()
base.type = 'base'
base.types = { base: base }
