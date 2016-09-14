/* eslint-env node */
"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const {resolve} = require("path")
const {routes, version} = require("./package.json")
const {hostname, port, protocol} = routes[ENVIRONMENT]
const webpack = require("webpack")
const marked = require("marked")
const {highlight} = require("highlight.js")
const autoprefixer = require("autoprefixer")

const PORT_POSTFIX = port ? `:${port}` : ""
const BASE_URL = `${hostname}${PORT_POSTFIX}`
const PROJECT_URL = `${protocol}://${BASE_URL}`
const exclude = /node_modules/

marked.setOptions({
  highlight(code, language) {
    code = code.replace(/\{\{BASE_URL\}\}/g, `//${BASE_URL}`)

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
      VERSION: JSON.stringify(version),
      BASE_URL: JSON.stringify(BASE_URL),
      PROJECT_URL: JSON.stringify(PROJECT_URL),
      "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
    })
  ].concat(plugins)

  $.resolve = {
    extensions: ["", ".js", ".json"],
    modules: [resolve(__dirname, "app"), "node_modules"]
  }

  $.postcss = () => [autoprefixer({remove: false, browsers: ["last 2 versions", "ie 10"]})]

  const minimizeParam = ENVIRONMENT === "development" ? "-minimize" : "minimize"

  $.module = {
    loaders: loaders.concat([
      {test: /\.md$/, loader: "html!markdown", exclude},
      {test: /\.pug$/, loader: "pug", exclude},
      {test: /\.png|jpe?g|gif$/i, loader: "url?limit=0", exclude},
      {test: /\.js$/, loader: "babel", exclude},
      {test: /\.svg$/, loader: "svg-inline", exclude},
      {test: /\.styl$/, loader: `css-to-string!css?${minimizeParam}!postcss!stylus?paths=app`}
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

    const devServerClient = `webpack-dev-server/client?http://0.0.0.0:${port}`

    if (Array.isArray($.entry)) {
      $.entry.unshift(devServerClient)
    }
    else {
      $.entry["dev-server-client"] = devServerClient
    }
  }

  return $
}
