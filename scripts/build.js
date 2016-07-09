/* eslint-env node */

const baseConfig = require("../webpack.config")
const resolve = require("path").resolve
const webpack = require("webpack")
const eachSeries = require("async").eachSeries
const del = require("del")

const optimizePlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  })
]

const entries = {
  "universal-embed-custom": {
    name: "UniversalEmbedCustom",
    path: "./app/custom.js"
  },
  "universal-embed-custom-page": {
    name: "UniversalEmbedCustomPage",
    path: "./app/custom-page.js"
  },
  "universal-embed": {
    name: "UniversalEmbed",
    path: "./app/index.js"
  }
}

const IDs = Object.keys(entries)

del.sync(resolve(__dirname, "../dist"))

baseConfig.plugins.unshift()

function buildEntry({optimize}, id, next) {
  const entry = entries[id]
  const entryConfig = Object.assign({}, baseConfig)
  const filename = optimize ? `${id}.min.js` : `${id}.js`

  if (optimize) {
    entry.plugins = optimizePlugins.concat(entry.plugins)
  }

  entryConfig.entry = {
    [id]: entry.path
  }

  Object.assign(entryConfig.output, {
    filename,
    sourceMapFilename: optimize ? `${id}.min.map` : `${id}.map`,
    library: entry.name
  })

  const compiler = webpack(entryConfig)

  compiler.run(error => {
    if (error) {
      console.log(error)
      return next(error)
    }

    console.log(`Built: ${filename} - ${entry.name}`)

    next()
  })
}

console.log("Building optimized bundles...")
eachSeries(IDs, buildEntry.bind(null, {optimize: true}), () => {
  console.log("\nBuilding pristine bundles...")
  eachSeries(IDs, buildEntry.bind(null, {optimize: false}))
})

