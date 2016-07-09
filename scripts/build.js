/* eslint-env node */

const baseConfig = require("../webpack.config")
const resolve = require("path").resolve
const webpack = require("webpack")
const eachSeries = require("async").eachSeries
const del = require("del")

function logError(error) {
  console.dir(error, {depth: null, colors: true})
}

const optimizePlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(true),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true
  })
]

const entries = {
  "universal-embed": {
    library: "UniversalEmbed",
    path: "./universal-embed.js"
  },
  "universal-embed-custom": {
    library: "UniversalEmbedCustom",
    path: "./custom.js"
  },
  "universal-embed-custom-page": {
    library: "UniversalEmbedCustomPage",
    path: "./custom-page.js"
  },
  "universal-embed-page-drupal": {
    library: "UniversalEmbedDrupalPage",
    path: "./pages/drupal.js"
  },
  "universal-embed-page-embed": {
    library: "UniversalEmbedEmbedPage", // TODO: Pick a different name.
    path: "./pages/embed.js"
  },
  "universal-embed-page-joomla": {
    library: "UniversalEmbedWordpressPage",
    path: "./pages/joomla.js"
  },
  "universal-embed-page-wordpress": {
    library: "UniversalEmbedWordpressPage",
    path: "./pages/wordpress.js"
  }
}

const IDs = Object.keys(entries)

del.sync(resolve(__dirname, "../dist"))

baseConfig.plugins.unshift()

function buildEntry({optimize}, id, next) {
  const {library, path} = entries[id]
  const entryConfig = Object.assign({}, baseConfig)
  const filename = optimize ? `${id}.min.js` : `${id}.js`

  if (optimize) {
    console.log("optimizing")
    entryConfig.plugins = optimizePlugins.concat(entryConfig.plugins)
  }

  entryConfig.entry = {
    [id]: path
  }

  Object.assign(entryConfig.output, {
    filename,
    sourceMapFilename: optimize ? `${id}.min.map` : `${id}.map`,
    library
  })

  const compiler = webpack(entryConfig)

  compiler.run((fatalError, stats) => {
    if (fatalError) throw fatalError

    const {errors, warnings} = stats.toJson()

    if (errors.length > 0 || warnings.length > 0) {
      logError(warnings)
      logError(errors)
      process.exit(1)
    }

    console.log(`Built: ${filename} - ${library}`)

    next()
  })
}

console.log("Building pristine bundles...")
eachSeries(IDs, buildEntry.bind(null, {optimize: false}), () => {
  console.log("\nBuilding optimized bundles...")
  eachSeries(IDs, buildEntry.bind(null, {optimize: true}))
})

