/* eslint-env node */

const baseConfig = require("../webpack.config.base")()
const del = require("del")
const {each} = require("async")
const webpack = require("webpack")
const {resolve} = require("path")
const {entries, IDs} = require("../modules")
const validate = require("./validate")
const fs = require("fs")
const zipFolder = require("zip-folder")

const ASSET_ARCHIVE_NAME = "assets.zip"

const {assign} = Object
const nodeTargetsDirectory = resolve(__dirname, "../targets")
const outputPath = baseConfig.output.path

const optimizePlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  })
]

console.log("Cleaning previous files...")
del.sync(outputPath)
del.sync(nodeTargetsDirectory)

fs.mkdirSync(nodeTargetsDirectory)

function buildEntry(id, next) {
  const {library, path} = entries[id]

  const configs = [
    assign({}, baseConfig, { // Default
      entry: {[id]: path},
      output: assign({}, baseConfig.output, {
        filename: `${id}.js`,
        library,
        sourceMapFilename: `${id}.map`
      })
    }),

    assign({}, baseConfig, { // Optimized
      entry: {[id]: path},
      output: assign({}, baseConfig.output, {
        filename: `${id}.min.js`,
        library,
        sourceMapFilename: `${id}.min.map`
      }),
      plugins: optimizePlugins.concat(baseConfig.plugins)
    })
  ]

  each(configs, (config, nextConfig) => {
    const compiler = webpack(config)

    compiler.run((fatalError, stats) => {
      validate(fatalError, stats)

      console.log(`+ ${config.output.filename}`)
      nextConfig()
    })
  }, next)
}

console.log("Building bundles...")
each(IDs, buildEntry, () => {
  zipFolder(`${outputPath}/assets/`, `${outputPath}/${ASSET_ARCHIVE_NAME}`, error => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`+ ${ASSET_ARCHIVE_NAME}`)
  })
})
