'use strict'
const createFilters = require('./filters').create
const empty = [] // dangerous people may change this, breaking everything

module.exports = function (type) {
  const keys = this._keys
  if (!keys) {
    return empty
  } else {
    if (type) {
      createFilters(this, type)
      const filters = this._filters
      if (!(type in filters)) {
        const filter = this.filterTypes
        const filtered = filters[type] = []
        for (let i = 0, len = keys.length; i < len; i++) {
          if (filter(this, keys[i], type)) {
            filtered.push(keys[i])
          }
        }
        return filtered
      } else {
        return filters[type]
      }
    } else if (this.filter) {
      createFilters(this, 'keys')
      const filters = this._filters
      if ('keys' in filters) {
        return filters.keys || empty
      } else {
        const filtered = filters.keys = []
        for (let i = 0, len = keys.length; i < len; i++) {
          if (this.filter(keys[i])) {
            filtered.push(keys[i])
          }
        }
        return filtered
      }
    } else {
      return keys
    }
  }
}
