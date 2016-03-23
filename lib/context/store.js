'use strict'

function keyStore (pcontext, level) {
  var pc = pcontext
  var keys
  while (level && pc) {
    if (pc._cKey) {
      if (!keys) {
        keys = {}
      }
      keys[level] = pc._cKey
    }
    pc = pc._parent
    level--
  }
  return keys
}

exports.storeContext = function (arr) {
  var context = this._c
  if (context) {
    if (!arr) {
      arr = []
    }
    let level = this._cLevel
    let pcontext = this
    while (context) {
      arr.push(context, level, keyStore(pcontext, level))
      pcontext = context
      level = context._cLevel
      context = context._c
    }
    return arr
  }
}

exports.applyContext = function (store) {
  if (!store) { return }
  const target = this
  var i = 0
  var parent = target
  var lvl
  var cntxt
  var keyStore
  while (parent) {
    if (!cntxt) {
      cntxt = store[i]
      lvl = store[i + 1]
      keyStore = store[i + 2]
    }
    if (keyStore && keyStore[lvl]) {
      parent._cKey = keyStore[lvl]
    }
    if (lvl === 1) {
      parent._c = cntxt
      parent._cLevel = lvl
      parent = cntxt
      i += 3
      if (i === store.length) {
        parent = null
      }
      cntxt = null
    } else {
      parent._c = cntxt
      parent._cLevel = lvl
      parent = parent._parent
      lvl--
    }
  }
}

