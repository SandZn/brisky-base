'use strict'
const base = require('../../')
const test = require('brisky-performance')
var amount = 1e6

function uid () {
  const a = base({ a: 100, b: 100 })
  for (let i = 0; i < amount; i++) {
    a._uid = 0
    a.uid()
  }
}

function nr () {
  var nr = 0
  const a = base({ a: 100, b: 100 })
  for (let i = 0; i < amount; i++) {
    a.nr = ++nr
  }
}

test(uid, nr, 10)
