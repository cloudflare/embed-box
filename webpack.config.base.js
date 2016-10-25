/* eslint-env node */
"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const {resolve} = require("path")
const {githubPath, routes, version} = require("./package.json")
const {hostname, port, protocol} = routes[ENVIRONMENT]
const webpack = require("webpack")
const marked = require("marked")
const {highlight} = require("highlight.js")
const autoprefixer = require("autoprefixer")

const PORT_POSTFIX = port ? `:${port}` : ""
const PROJECT_URL = `${protocol}://${hostname}${PORT_POSTFIX}`
const exclude = /node_modules/
const {stringify} = JSON
const ASSET_CDN_URL = `https://cdn.rawgit.com/${githubPath}/v${version}`

marked.setOptions({
  highlight(code, language) {
    code = code.replace(/\{\{PROJECT_URL\}\}/g, PROJECT_URL)

    return highlight(language, code).value
  }
})

const renderer = new marked.Renderer()
const DIST_DIRECTORY_NAME = "dist"

module.exports = function createWebpackConfig(overrides = {}) {
  const buildDirectory = overrides.buildDirectory || DIST_DIRECTORY_NAME
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
      ASSET_CDN_URL: stringify(ASSET_CDN_URL),
      ASSET_PATH: stringify(ENVIRONMENT === "development" ? PROJECT_URL : `${ASSET_CDN_URL}/${DIST_DIRECTORY_NAME}`),
      VERSION: stringify(version),
      PROJECT_URL: stringify(PROJECT_URL),
      "process.env.NODE_ENV": stringify(ENVIRONMENT)
    })
  ].concat(plugins)

  $.resolve = {
    extensions: ["", ".js", ".json"],
    modules: [resolve(__dirname, "app"), "node_modules"]
  }

  $.postcss = () => [autoprefixer({remove: false, browsers: ["last 2 versions", "ie 10"]})]

  const minimizeParam = ENVIRONMENT === "development" ? "-minimize" : "minimize"
  const filePathPrefix = ENVIRONMENT === "development" ? "" : "assets/"

  $.module = {
    loaders: loaders.concat([
      {test: /\.md$/, loader: "html!markdown", exclude},
      {test: /\.pug$/, loader: "pug", exclude},
      {test: /\.png|jpe?g|gif$/i, loader: `file?name=${filePathPrefix}[path][name].[ext]`, exclude: /site/},
      {test: /\.js$/, loader: "babel", exclude},
      {test: /\.svg$/, loader: "svg-inline", exclude},
      {
        test: /\.styl$/,
        exclude: /site/,
        loader: `css-to-string!css?${minimizeParam}!postcss!stylus?paths=app`
      }
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
