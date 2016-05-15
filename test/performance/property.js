'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 5e4
var hri = require('human-readable-ids').hri
var obj = {}
for (var i = 0; i < amount; i++) {
  obj[hri.random()] = {
    index: i
  }
}

function baseline () {
  // some weird baseline
}

const SpecialBase = new Base({
  properties: { index: true }
}).Constructor

function property () {
  var a = new SpecialBase(obj)
}

console.log(obj, SpecialBase.prototype._mapProperty)

test(property, baseline, 5)
