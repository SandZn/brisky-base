'use strict'
module.exports = function (target) {
  target._mapProperty = null
  target._mapTarget = target
}
