'use strict'
const helpers = require('./shared')
const getPath = helpers.getPath
const returnFilter = helpers.returnFilter
const returnPath = helpers.returnPath

/**
 * @function lookUp
 * @memberOf Base#
 * @param  {string|string[]} path Path or field to find in parent tree
 * @param  {*} [options] {regexp} Results will be tested using rexexp
 * <br>{base|string|boolean} Use options to compare with results
 * <br>{function} Call for each result, with result as param
 * <br>{object} Can contain the following:
 * @param  {object} options.conditions Results will be tested by these conditions
 * @return {object} result
 */
exports.define = {
  lookUp (path, options) {
    const parent = this.parent
    var filter
    if (parent) {
      filter = returnFilter(options)
      path = returnPath(path)
      return lookUpParent(parent, path, path.length, filter)
    }
  }
}

function lookUpParent (parent, path, length, filter) {
  const oneKey = path.length === 1
  return (oneKey && parent.key === path[0] && parent) ||
    getPath(parent, path, length, filter) ||
    (parent = parent.parent) && lookUpParent(parent, path, length, filter)
}
