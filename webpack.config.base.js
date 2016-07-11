/* eslint-env node */
"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const {resolve} = require("path")
const routes = require("./package.json").routes[ENVIRONMENT]
const nib = require("nib")()
const webpack = require("webpack")

const exclude = /node_modules/

module.exports = function createWebpackConfig(overrides = {}) {
  const buildDirectory = overrides.buildDirectory || "dist"
  const {entry = {}, output = {}, plugins = []} = overrides
  const $ = {}

  $.buildDirectory = buildDirectory

  $.devtool = "source-map"

  $.entry = entry

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
    loaders: [
      {test: /\.pug$/, loader: "jade-loader", exclude},
      {test: /\.png|jpe?g|gif$/i, loader: "url-loader?limit=0", exclude},
      {test: /\.js$/, loader: "babel-loader", exclude},
      {test: /\.svg$/, loader: "svg-inline", exclude},
      {test: /\.styl$/, loader: "css-to-string!css!autoprefixer!stylus-loader?paths=app/resources/"}
    ],
    noParse: /\.min\.js/
  }

  if (ENVIRONMENT === "development") {
    $.devtool = "eval"

    $.module.preLoaders = [{
      exclude,
      loader: "eslint-loader",
      test: /\.js$/
    }]

    $.entry.unshift(`webpack-dev-server/client?http://0.0.0.0:${routes.views.port}`)
  }

  return $
}
