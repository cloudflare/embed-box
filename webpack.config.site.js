/* eslint-env node */
"use strict"

const createWebpackConfig = require("./webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = createWebpackConfig({
  buildDirectory: "./",

  entry: ["./app/site.js"],

  output: {
    filename: "site.js",
    sourceMapFilename: "site.map"
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.pug"
    })
  ]
})
