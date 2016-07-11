/* eslint-env node */

const baseConfig = require("../webpack.config.base")()
const siteConfig = require("../webpack.config.site")
const del = require("del")
const {each} = require("async")
const webpack = require("webpack")
const {entries, IDs} = require("./distributions")

const {assign} = Object

function logError(error) {
  console.dir(error, {depth: null, colors: true})
}

function validate(fatalError, stats) {
  if (fatalError) throw fatalError

  const {errors, warnings} = stats.toJson()

  if (errors.length > 0 || warnings.length > 0) {
    logError(warnings)
    logError(errors)
    process.exit(1)
  }
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
      validate(fatalError, stats)

      console.log(`- ${config.output.filename}`)
      nextConfig()
    })
  }, next)
}

console.log("Building bundles...")
each(IDs, buildEntry)

const compiler = webpack(siteConfig)

compiler.run((fatalError, stats) => {
  validate(fatalError, stats)

  console.log("- Universal Embed Documentation https://universalembed.io")
})


