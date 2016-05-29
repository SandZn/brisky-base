'use strict'
const test = require('tape')
const Base = require('../')

test('compute', function (t) {
  const d = new Base()
  t.equal(d.compute(), d, 'd - returns itself as default value')
  d.val = function (start, stamp, previous, attach) {
    t.equal(previous, 'previous', 'correct previous')
    t.equal(stamp, 'stamp', 'correct stamp')
    t.equal(start, 'previous', 'correct start')
    t.equal(attach, 'attach', 'correct attach')
    return 'lulz'
  }
  t.equal(
    d.compute(void 0, 'previous', void 0, 'stamp', 'attach'),
    'lulz',
    'correct returend value when used with a function'
  )
  t.end()
})

test('compute - references and override', function (t) {
  var bStart
  var cnt = 0
  const b = new Base({
    key: 'b',
    val: 100,
    define: {
      extend: {
        compute (compute, val, previous, start, stamp) {
          bStart = start
          cnt++
          return compute.call(this, val, previous, start, stamp)
        }
      }
    }
  })
  const a = new Base({
    key: 'a',
    val: b
  })
  t.equal(a.compute(), 100, 'a - correct value')
  t.equal(bStart, a, 'b - correct start value')
  t.equal(a.compute('hello'), 'hello', 'correct value (override)')
  t.equal(cnt, 1, 'b does not fire')
  const c = new Base({
    key: 'c',
    val: a
  })
  t.equal(c.compute(), 100, 'c - correct value')
  t.equal(bStart, c, 'b - correct start value')
  t.end()
})
