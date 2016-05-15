'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e4
var hri = require('human-readable-ids').hri
var obj = {}
for (var i = 0; i < amount; i++) {
  obj[hri.random()] = {
    index: i
  }
}

const SpecialBase = new Base({
  properties: { index: true }
}).Constructor

function createSpecialBase () {
  for (var i = 0; i < amount * 2; i++) {
     new SpecialBase(i)
  }
}

function property () {
  var a = new SpecialBase(obj)
}

test(property, createSpecialBase, 10)
