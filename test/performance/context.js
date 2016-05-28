'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e4

function setKeys () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: 1 })
  }
}

function setKeysContext () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' }) //eslint-disable-line
  for (let i = 0; i < amount; i++) {
    // much better stratgy is to set it straight on the correct field vs doing weird context getter shit later
    a.set({ [i]: 1 })
  }
}

test(setKeysContext, setKeys, 1)

function createConstructors () {
  for (let i = 0; i < amount; i++) {
    let a = new Base({ a: 100, b: 100 })  //eslint-disable-line
    let b = new a.Constructor({ key: 'ITS B' }) //eslint-disable-line
  }
}

test(createConstructors, function () {}, 1)
