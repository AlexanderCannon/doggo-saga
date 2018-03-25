process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', err => { throw err }) // eslint-disable-line

require('../config/env')

const fs = require('fs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const clearConsole = require('react-dev-utils/clearConsole')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')
const openBrowser = require('react-dev-utils/openBrowser')
const paths = require('../config/paths')
const config = require('../config/webpack.config.dev')
const createDevServerConfig = require('../config/webpackDevServer.config')

const useYarn = fs.existsSync(paths.yarnLockFile)
const isInteractive = process.stdout.isTTY

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'

if (process.env.HOST) {
  console.log( // eslint-disable-line
    `Attempting to bind to HOST environment variable: ${process.env.HOST}`,
    'If this was unintentional, check that you haven\'t mistakenly set it in your shell.',
  )
}

choosePort(HOST, DEFAULT_PORT)
  .then((port) => {
    if (port == null) {
      return
    }
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const appName = require(paths.appPackageJson).name // eslint-disable-line
    const urls = prepareUrls(protocol, HOST, port)
    const compiler = createCompiler(webpack, config, appName, urls, useYarn)
    const proxySetting = require(paths.appPackageJson).proxy // eslint-disable-line
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic)
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig,
    )
    const devServer = new WebpackDevServer(compiler, serverConfig)
    devServer.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err) // eslint-disable-line
      }
      if (isInteractive) {
        clearConsole()
      }
      console.log('Starting the development server...\n') // eslint-disable-line
      return openBrowser(urls.localUrlForBrowser)
    })

    const sigs = ['SIGINT', 'SIGTERM']
    sigs.forEach((sig) => {
      process.on(sig, () => {
        devServer.close()
        process.exit()
      })
    })
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message) // eslint-disable-line
    }
    process.exit(1)
  })
