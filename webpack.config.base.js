/* eslint-env node */
"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const {resolve} = require("path")
const route = require("./package.json").routes[ENVIRONMENT]
const nib = require("nib")()
const webpack = require("webpack")
const marked = require("marked")
const {highlight} = require("highlight.js")

const exclude = /node_modules/

marked.setOptions({
  highlight(code, language) {
    return highlight(language, code).value
  }
})

const renderer = new marked.Renderer()

module.exports = function createWebpackConfig(overrides = {}) {
  const buildDirectory = overrides.buildDirectory || "dist"
  const {entry = {}, loaders = [], output = {}, plugins = []} = overrides
  const $ = {}

  $.buildDirectory = buildDirectory

  $.devtool = "source-map"

  $.entry = entry

  $.markdownLoader = {renderer}

  $.output = Object.assign({
    path: resolve(__dirname, buildDirectory),
    publicPath: "/",
    libraryTarget: "umd",
    umdNamedDefine: true
  }, output)

  $.plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
    })
  ].concat(plugins)

  $.resolve = {
    extensions: ["", ".js", ".json"],
    modules: [resolve(__dirname, "app"), "node_modules"]
  }

  $.stylus = {
    use: [nib],
    import: ["~nib/lib/nib/index.styl"]
  }

  $.module = {
    loaders: loaders.concat([
      {test: /\.md$/, loader: "html!markdown", exclude},
      {test: /\.pug$/, loader: "jade", exclude},
      {test: /\.png|jpe?g|gif$/i, loader: "url?limit=0", exclude},
      {test: /\.js$/, loader: "babel", exclude},
      {test: /\.svg$/, loader: "svg-inline", exclude},
      {test: /\.styl$/, loader: "css-to-string!css!autoprefixer!stylus-loader?paths=app/resources/"}
    ]),
    noParse: /\.min\.js/
  }

  if (ENVIRONMENT === "development") {
    $.devtool = "eval"

    $.module.preLoaders = [{
      exclude,
      loader: "eslint-loader",
      test: /\.js$/
    }]

    const devServerClient = `webpack-dev-server/client?http://0.0.0.0:${route.port}`

    if (Array.isArray($.entry)) {
      $.entry.unshift(devServerClient)
    }
    else {
      Object.assign($.entry, {devServerClient})
    }
  }

  return $
}
