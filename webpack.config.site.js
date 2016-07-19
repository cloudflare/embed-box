/* eslint-env node */
"use strict"

const createWebpackConfig = require("./webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const extractCSS = new ExtractTextPlugin("site.css")

module.exports = createWebpackConfig({
  buildDirectory: "./",

  entry: ["./app/site.js"],

  loaders: [
    {
      test: /\.external-styl$/,
      loader: ExtractTextPlugin.extract({
        notExtractLoader: "style",
        loader: "css!autoprefixer!stylus-loader?paths=app/resources/"
      })
    }
  ],

  output: {
    filename: "site.js",
    sourceMapFilename: "site.map"
  },

  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      template: "app/index.pug"
    })
  ]
})
