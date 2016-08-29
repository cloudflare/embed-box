/* eslint-env node */
"use strict"

const createWebpackConfig = require("../webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = createWebpackConfig({
  entry: {
    test: "./test.js"
  },

  output: {
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "EmbedBox Test",
      template: "./test.pug"
    })
  ]
})
