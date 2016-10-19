'use strict'
const base = require('../..')
const test = require('brisky-performance')
var amount = 1e4

function createNormalObject () {
  for (var i = 0; i < amount; i++) {
    var a = { val: i } //eslint-disable-line
  }
}

function createBase () {
  for (var i = 0; i < amount; i++) {
    var a = base(i) //eslint-disable-line
  }
}

/* istanbul ignore next */
test(createBase, createNormalObject, 10)
