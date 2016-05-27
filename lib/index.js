'use strict'
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
const Base = module.exports = function (val, stamp, parent, key) {
  this.setParent(val, stamp, parent, key)
  this._Constructor = null
  this._ownKeys = null
  if (val !== void 0) {
    this.set(val, stamp || false, true)
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
Object.defineProperty(base, 'define', {
  value: require('vigour-util/define'),
  configurable: true
})

// see base as one file, split up for convienience (not injectable)
base.define(
  { isBase: true },
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
  require('./inject'),
  require('./bind'),
  require('./compute'),
  require('./set/property/definition')
)

// ---------- non core --- maybe make this seperate modules -------
base.inject(
  require('./method/each'),
  require('./method/toString'),
  require('./method/get'),
  require('./method/lookUp'),
  require('./method/serialize'),
  require('./method/path'),
  require('./method/root'),
  require('./uid'),
  require('./types'),
  require('./keys')
)

base.types = { base: base }
