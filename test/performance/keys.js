'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e6

function createBase () {
  for (var i = 0; i < amount; i++) {
    var a = new Base(i) //eslint-disable-line
  }
}

function createBaseKeys () {
  var am = Math.round(amount / 2)
  for (var i = 0; i < am; i++) {
    var a = new Base({ a: i }) //eslint-disable-line
  }
}

test(createBaseKeys, createBase, 5)

