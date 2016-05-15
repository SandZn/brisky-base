'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e4

function createBase () {
  for (var i = 0; i < amount; i++) {
    var a = new Base(i) //eslint-disable-line
  }
}

function createBaseKeys () {
  for (var i = 0; i < amount; i++) {
    var a = new Base({ a: i }) //eslint-disable-line
  }
}

test(createBaseKeys, createBase, 10)

