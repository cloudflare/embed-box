/* eslint-env node */

"use strict"

const ENVIRONMENT = process.env.NODE_ENV || "development"
const resolve = require("path").resolve
const routes = require("./package.json").routes[ENVIRONMENT]
const HtmlWebpackPlugin = require("html-webpack-plugin")
const webpack = require("webpack")

const buildDirectory = exports.buildDirectory = "build"

exports.devtool = "source-map"

exports.entry = [
  "./app/index.js"
]

exports.module = {
  loaders: [],
  noParse: /\.min\.js/
}

exports.output = {
  filename: "[name].js",
  path: resolve(__dirname, buildDirectory),
  publicPath: "/",
  sourceMapFilename: "[name].map"
}

exports.plugins = [
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(ENVIRONMENT)
  }),
  new HtmlWebpackPlugin({
    meta: {title: "Eager"},
    template: "app/index.ejs"
  })
]

exports.resolve = {
  extensions: ["", ".js", ".json"],
  modules: [resolve(__dirname, "app"), "node_modules"]
}

exports.stylus = {
  use: [require("nib")()],
  import: ["~nib/lib/nib/index.styl"]
}

exports.module.loaders.push(
  {test: /\.svg$/, loader: "svg-inline", exclude: /node_modules/},
  {test: /\.styl$/, loader: "style-loader?singleton!css-loader!autoprefixer!stylus-loader?paths=app/resources/"},
  {test: /\.js$/, loader: "babel-loader", exclude: /node_modules/}
)

if (ENVIRONMENT === "development") {
  exports.devtool = "cheap-module-eval-source-map"

  exports.module.preLoaders = [{
    exclude: /node_modules/,
    loader: "eslint-loader",
    test: /\.js$/
  }]

  exports.entry.unshift(`webpack-dev-server/client?http://0.0.0.0:${routes.views.port}`)
}
