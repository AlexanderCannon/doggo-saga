process.env.BABEL_ENV = 'production'
process.env.NODE_ENV = 'production'

process.on('unhandledRejection', (err) => {
  throw err
})

require('../config/env')

const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')
const paths = require('../config/paths')
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printHostingInstructions = require('react-dev-utils/printHostingInstructions')
const FileSizeReporter = require('react-dev-utils/FileSizeReporter')
const printBuildError = require('react-dev-utils/printBuildError')

const { measureFileSizesBeforeBuild } = FileSizeReporter
const { printFileSizesAfterBuild } = FileSizeReporter
const useYarn = fs.existsSync(paths.yarnLockFile)

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1)
}


function build(previousFileSizes) {
  console.log('Creating an optimized production build...') // eslint-disable-line

  const compiler = webpack(config)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err)
      }
      const messages = formatWebpackMessages(stats.toJson({}, true))
      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1
        }
        return reject(new Error(messages.errors.join('\n\n')))
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log( // eslint-disable-line
          '\nTreating warnings as errors because process.env.CI = true.\n',
          'Most CI servers set it automatically.\n',
        )
        return reject(new Error(messages.warnings.join('\n\n')))
      }
      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      })
    })
  })
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  })
}


measureFileSizesBeforeBuild(paths.appBuild)
  .then((previousFileSizes) => {
    fs.emptyDirSync(paths.appBuild)
    copyPublicFolder()
    return build(previousFileSizes)
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log( // eslint-disable-line
          'Compiled with warnings.\n',
          warnings.join('\n\n'),
          '\nSearch for the keywords to learn more about each warning.',
          'To ignore, add // eslint-disable-next-line to the line before.\n',
        )
      } else {
        console.log('Compiled successfully.\n') // eslint-disable-line
      }

      console.log('File sizes after gzip:\n') // eslint-disable-line
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE,
        '\n',
      )

      const appPackage = require(paths.appPackageJson) // eslint-disable-line
      const { publicUrl } = paths
      const { publicPath } = config.output
      const buildFolder = path.relative(process.cwd(), paths.appBuild)
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn,
      )
    },
    (err) => {
      console.log('Failed to compile.\n') // eslint-disable-line
      printBuildError(err)
      process.exit(1)
    },
  )
