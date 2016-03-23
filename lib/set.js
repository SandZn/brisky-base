'use strict'
const Base = require('./')
const isPlainObj = require('vigour-util/is/plainobj')
const parseref = require('./parseref')
/**
 * @function setValueInternal
 * @memberOf Base#
 * @param  {*} val The value that will be set on val
 * @param {Event} [stamp] Current stamp
 * @return {Base} this
 */
exports.setValueInternal = function (val, stamp) {
  this.val = val
  return this
}

/**
 * @function setValue
 * @memberOf Base#
 * @param {*} val The value that will be set on val
 * @param {Event} [stamp] Current stamp
 * @param {resolveContext} [boolean] tells if context has to be resolved
 * @return {Base|undefined} if undefined no change happened
 */
exports.setValue = function (val, stamp, resolveContext) {
  if (val === this.val) {
    // no change dont do anything
    return
  }
  if (val === null) {
    let r = this.remove(stamp)
    return r || this
  } else if (resolveContext) {
    return this.resolveContext(val, stamp)
  } else {
    return this.setValueInternal(val, stamp)
  }
}

/**
 * @function set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [stamp]
 *   when false stamps are not executed
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @param  {escape} [boolean] escape reserved fields
 * @return {Base|undefined} if undefined no change happened
 */
exports.set = function (val, stamp, nocontext, escape) {
  var base = this
  const resolveContext = !nocontext && base._context
  if (isPlainObj(val)) {
    if (resolveContext) {
      base = base.resolveContext(val, stamp)
    } else {
      let changed
      // make perf tests for this looks very slow
      if (val.components) {
        if (base.setKey('components', val.components, stamp, nocontext, escape)) {
          changed = true
        }
      }

      if (val.inject) {
        if (base.setKey('inject', val.inject, stamp, nocontext, escape)) {
          changed = true
        }
      }

      for (let key in val) {
        if (base.val === null) {
          break
        }
        if (key === 'inject' || key === 'components') {
          // this can become a lot better
        } else if (key === 'val') {
          if (base.setValue(val[key], stamp, resolveContext)) {
            changed = true
          }
        } else {
          if (base.setKey(key, val[key], stamp, nocontext, escape)) {
            changed = true
          }
        }
      }
      if (!changed) {
        return
      }
    }
  } else {
    base = base.setValue(val, stamp, resolveContext)
  }
  return base
}

/**
 * removes context -- for base this just means nulling one property,
 * however observables need to fire remove stamps for context
 * @param  {[type]} key   [description]
 * @param  {[type]} stamp
 * @return {[type]}
 */
exports.contextRemove = function (key, stamp) {
  this[key] = null
  return this
}

/**
 * @function setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for ._useVal|.useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Event} [stamp]
 *   adds emiters to stamp if stamp is defined
 *   when false stamp emiters are not added
 * @param {nocontext} [boolean] dont resolveContext when true
 * @todo double check if a property set returning undefined is ok
 * @return {Base|undefined} this, if undefined no relevant change happened
 */
exports.setKeyInternal = function (key, val, property, stamp, nocontext, escape) {
  if (property && val && isPlainObj(val) && val.type) {
    property.remove(false)
    property = void 0
  }

  if (property) {
    if (property._parent !== this && !property.noContext) {
      if (val === null) {
        return this.contextRemove(key, stamp)
      } else {
        const Constructor = property.Constructor
        if (escape && !Constructor) {
          if (typeof escape === 'string') {
            key = escape + key
          } else {
            key = 'escaped_' + key
          }
          this.setKeyInternal(key, val, this[key], stamp, nocontext, escape)
        } else if (Constructor === false) {
          property.set(val, stamp, void 0, escape)
        } else if (!Constructor) {
          let path = this.path() // eslint-disable-line
          path = path.length ? ' "' + path + '"' : ''
          throw new Error(
            `cannot set property "$(key)",
            on "$(this.type)"$(path)
            it\'s reserved`
          )
        } else {
          this[key] = new Constructor(void 0, false, this, key, escape)
          this[key].set(val, stamp, nocontext, escape)
          return this[key]
        }
      }
    } else {
      property.set(val, stamp, nocontext, escape)
      return
    }
  } else {
    if (val !== null) {
      if (val && isPlainObj(val) && val.type) {
        val = this.getType(val, stamp, key, void 0, escape)
      }
      this.addNewProperty(key, val, property, stamp, escape)
      return this
    } else {
      return
    }
  }
}

/**
 * @function addNewProperty
 * @memberOf Base#
 * @param {String} key Key to be set on new property
 * @param {*} val The value that will be set on val
 * @param {Event} [stamp] Current stamp
 * @param {property} [base] Property to be set
 * @todo requires perf optmizations
 * @return {Base} this
 */
exports.addNewProperty = function (key, val, property, stamp, escape) {
  val = this.getPropertyValue(val, stamp, this, key, escape)
  this[key] = val
  var parent = this
  while (parent) {
    if (parent.hasOwnProperty('_Constructor')) {
      this.createContextGetter(key)
      parent = null
    } else {
      parent = parent._parent
    }
  }
}

/**
 * @function checkUseVal
 * checks the useVal of a property
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {*} returns useval property
 */
function checkUseVal (useVal, val, stamp, parent, key) {
  val = useVal === true ? val : useVal
  if (val instanceof Base) {
    if (!val.hasOwnProperty('_parent') || val._parent === parent) {
      val.key = key
      val._parent = parent
      return val
    }
  } else {
    return val
  }
}

/**
 * @function getPropertyValue
 * checks if property thats being set has a useVal or UseConstructor
 * else creates a new instance of Child
 * useVal will override default behaviour and use the value directly as property
 * @memberOf Base#
 * @return {Base} returns new instance of property Constructor
 */
exports.getPropertyValue = function (val, stamp, parent, key, escape) {
  // do type check in here
  if (val) {
    let useVal = (!val.hasOwnProperty('_parent') || val._parent === parent) && (val._useVal || val.useVal)
    if (useVal) {
      let prop = checkUseVal(useVal, val, stamp, parent, key)
      if (prop) {
        return prop
      }
    }
  }
  return parent.Child
    ? new parent.Child(val, stamp, parent, key, escape)
    : val
}

/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Event} [stamp] Current stamp
 * @param  {nocontext} [boolean] dont resolveContext when true
 * @return {Base|undefined} if undefined no change happened
 */
const matchType = /\:([a-z\d]+)$/i
exports.mapProperty = function (key, val, stamp, nocontext, escape) {
  const result = typeof key === 'string' && key.match(matchType)
  return result && result[1]
}

const reference = /^\$(\/|\.\/)/
exports.setKey = function (key, val, stamp, nocontext, escape) {
  var type = key

  if (
    typeof val === 'string' &&
    reference.test(val)
  ) {
    val = parseref(this, val)
  } else if (val && typeof val === 'object') {
    if (
      val instanceof Array && (val[0] === '$' || val[0] === '$.') ||
      val.val && val.val instanceof Array
    ) {
      if (val.val) {
        let newVal = {}
        // faster way to copy
        for (let key in val) {
          newVal[key] = val[key]
        }
        newVal.val = parseref(this, val.val)
        val = newVal
      } else {
        val = parseref(this, val)
      }
    }
  }

  if (escape) {
    // does not really catch all options
    if (key === 'parent' || key === 'path' || key === 'properties') {
      if (typeof escape === 'string') {
        key = escape + key
      } else {
        key = 'escaped_' + key
      }
    }
  } else if (
    this.properties[key] ||
    (
      (type = this.mapProperty(key, val, stamp, nocontext, escape)) &&
      this.properties[type]
    )
  ) {
    return this.properties[type].call(this, val, stamp, nocontext, key, escape)
  }
  return this.setKeyInternal(key, val, this[key], stamp, nocontext, escape)
}
