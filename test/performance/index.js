'use strict'
var d = Date.now()
const isNode = require('vigour-util/is/node')
// require('./create')
// require('./keys')
require('./property')

setTimeout(() => {
  d = Date.now() - d
  const str = 'perf tests complete in ' + d + 'ms'
  if (!isNode) {
    document.body.style.background = 'rgb(38, 50, 56)'
    document.body.style.color = 'rgb(128, 203, 196)'
    document.body.style.fontFamily = 'helvetica'
    document.body.style.textAlign = 'center'
    document.body.style.paddingTop = '50px'
    document.body.innerHTML = str
  }
  console.log(str)
})
