'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://jyhadmapi.hztaidong.com"',

  IMAGE_API: '"http://jyhimg.hztaidong.com"'

  //  BASE_API: '"http://admapi.ijyh.net"',

  // IMAGE_API: '"http://img.ijyh.net"'
})
