'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e3

function createBase () {
  for (let i = 0; i < amount; i++) {
    const a = new Base(i) //eslint-disable-line
  }
}

function createBaseKeys () {
  for (let i = 0; i < amount; i++) {
    const a = new Base({ a: i }) //eslint-disable-line
  }
}

// test(createBaseKeys, createBase, 10)

function getKeys () {
  const a = new Base({ a: 100, b: 100 })
  for (let i = 0; i < amount; i++) {
    a._keys = null
    a.keys()
  }
}

// test(getKeys, createBaseKeys, 10)

function getKeysContext () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor()
  for (let i = 0; i < amount; i++) {
    b._keys = null
    b.keys()
  }
}

// test(getKeysContext, getKeys, 2)

function setKeys () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < 1e3; i++) {
    b.set({ [i]: 1 })
  }
  for (let i = 0; i < amount; i++) {
    b.clearKeys()
    b.keys()
  }
}

test(setKeys, createBaseKeys, 2)
