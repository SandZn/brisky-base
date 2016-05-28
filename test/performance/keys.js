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

function setKeys () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: 1 })
  }
}

// test(setKeys, createBaseKeys, 5)

// function removeKeys () {
//   const a = new Base({ a: 100, b: 100 })
//   const b = new a.Constructor({ key: 'ITS B' })
//   for (let i = 0; i < amount; i++) {
//     b.set({ [i]: 1 })
//   }
//   for (let i = 0; i < amount; i++) {
//     // b[i].remove(false, true, true)
//     b[i].remove()
//     // b.keys()
//   }
// }

// test(removeKeys, setKeys, 2, 20)

function orderedKeysBest () {
  const b = new Base({
    ordered: true
  })
  for (let i = 0; i < amount; i++) {
    b.set({
      [i]: {
        order: i
      }
    })
  }
}

test(orderedKeysBest, setKeys, 1.5)

function orderedKeysWorst () {
  const b = new Base({
    ordered: true
  })
  for (let i = 0; i < amount; i++) {
    b.set({
      [i]: {
        order: amount - i
      }
    })
  }
}

test(orderedKeysWorst, setKeys, 7.5)

function setKeysRandom () {
  const a = new Base({ a: 100, b: 100 })
  const b = new a.Constructor({ key: 'ITS B' })
  for (let i = 0; i < amount; i++) {
    b.set({ [i]: ~~(Math.random() * amount) })
  }
}

function orderedKeysRandom () {
  const b = new Base({
    ordered: true
  })
  for (let i = 0; i < amount; i++) {
    b.set({
      [i]: {
        order: ~~(Math.random() * amount)
      }
    })
  }
}

test(orderedKeysRandom, setKeysRandom, 2)
