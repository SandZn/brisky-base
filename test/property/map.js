'use strict'
const test = require('tape')
const Base = require('../../')

test('property - map - set', function (t) {
  const a = new Base()
  t.equal(a._mapTarget, Base.prototype, 'mapTarget equals base')
  t.equal(a._mapProperty, null, '_mapProperty equals null')
  a.properties = { a: true }
  t.equal('a' in a.properties, true, 'created property a')
  t.equal(a._mapTarget, a, 'after setting properties, mapTarget equals a')
  for (let i = 0; i < 500; i++) {
    a.set({ field: i })
  }
  t.equal(typeof a._mapProperty, 'function', 'after 500 setKeys creates an optmized property method')
  t.end()
})
