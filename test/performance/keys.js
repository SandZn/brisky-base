'use strict'
const Base = require('../../')
const test = require('vigour-performance')
var amount = 1e4

// function createBase () {
//   for (let i = 0; i < amount; i++) {
//     const a = new Base(i) //eslint-disable-line
//   }
// }

// function createBaseKeys () {
//   for (let i = 0; i < amount; i++) {
//     const a = new Base({ a: i }) //eslint-disable-line
//   }
// }

// test(createBaseKeys, createBase, 10)

// function getKeys () {
//   const a = new Base({ a: 100, b: 100 })
//   for (let i = 0; i < amount; i++) {
//     a._keys = null
//     a._rawKeys = null
//     a.keys()
//   }
// }

// test(getKeys, createBaseKeys, 10)

// function getKeysContext () {
//   const a = new Base({ a: 100, b: 100 })
//   const b = new a.Constructor()
//   for (let i = 0; i < amount; i++) {
//     b._keys = null
//     a._rawKeys = null
//     b.keys()
//   }
// }

// test(getKeysContext, getKeys, 2)
function setKeys () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: 1 })
    b.keys()
  }
}
// test(setKeys, createBaseKeys, 2)

function removeKeys () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: 1 })
  }
  for (let i = 0; i < amount; i++) {
    // b[i].remove(false, true, true)
    b[i].remove()
    // b.keys()
  }
}

test(removeKeys, setKeys, 2, 20)
