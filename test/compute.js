'use strict'
const test = require('tape')
const Base = require('../')

test('compute', t => {
  const d = Base()
  t.equal(d.compute(), d, 'd - returns itself as default value')
  d.val = function (previous, start, stamp, attach) {
    t.equal(previous, 'previous', 'correct previous')
    t.equal(stamp, 'stamp', 'correct stamp')
    t.equal(start, 'start', 'correct start')
    t.equal(attach, 'attach', 'correct attach')
    return 'lulz'
  }
  t.equal(
    d.compute(void 0, 'previous', 'start', 'stamp', 'attach'),
    'lulz',
    'correct returend value when used with a function'
  )
  t.end()
})

test('compute - references and override', t => {
  var cnt = 0
  const b = Base({
    key: 'b',
    val: 100,
    define: {
      extend: {
        compute (method, previous, start, stamp) {
          cnt++
          return method.call(this, previous, start, stamp)
        }
      }
    }
  })
  const a = Base({
    key: 'a',
    val: b
  })
  t.equal(a.compute(), 100, 'a - correct value')
  t.equal(a.compute('hello'), 'hello', 'correct value (override)')
  t.equal(cnt, 1, 'b does not fire')
  const c = Base({
    key: 'c',
    val: a
  })
  t.equal(c.compute(), 100, 'c - correct value')
  t.end()
})
