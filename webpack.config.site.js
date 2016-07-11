/* eslint-env node */
"use strict"

const createWebpackConfig = require("./webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = createWebpackConfig({
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.pug"
    })
  ]
})
