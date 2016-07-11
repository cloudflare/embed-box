/* eslint-env node */

const baseConfig = require("../webpack.config.base")()
const del = require("del")
const {each} = require("async")
const webpack = require("webpack")
const {entries, IDs} = require("./distributions")

const {assign} = Object

function logError(error) {
  console.dir(error, {depth: null, colors: true})
}

const optimizePlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  })
]

del.sync(baseConfig.output.path)

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
      if (fatalError) throw fatalError

      const {errors, warnings} = stats.toJson()

      if (errors.length > 0 || warnings.length > 0) {
        logError(warnings)
        logError(errors)
        process.exit(1)
      }

      console.log(`- ${config.output.filename}`)
      nextConfig()
    })
  }, next)
}

console.log("Building bundles . . .")
each(IDs, buildEntry)

