if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable() // eslint-disable-line
  window.Promise = require('promise/lib/es6-extensions.js') // eslint-disable-line
}

require('whatwg-fetch')

Object.assign = require('object-assign')

if (process.env.NODE_ENV === 'test') {
  require('raf').polyfill(global) // eslint-disable-line
}
