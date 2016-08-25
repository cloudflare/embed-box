/* eslint-env node */
"use strict"

const createWebpackConfig = require("./webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const extractCSS = new ExtractTextPlugin("site.css")

module.exports = createWebpackConfig({
  // TODO: It'd be nice if this was fetched from deploy.yaml
  buildDirectory: "site-deploy",

  entry: {
    site: "./app/site/index.js",
    "embed-box": "./app/site/globals/embed-box.js",
    "embed-box-custom": "./app/site/globals/embed-box-custom.js",
    "embed-box-custom-target": "./app/site/globals/embed-box-custom-target.js",
    // segment: "./app/site/segment.js"
  },

  loaders: [
    {
      test: /\.external-styl$/,
      loader: ExtractTextPlugin.extract({
        notExtractLoader: "style",
        loader: "css!postcss!stylus?paths=app/"
      })
    }
  ],

  output: {
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  },

  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      title: "EmbedBox install UI by Eager",
      description: "An open-source UI which makes it easy for your users to install your embed code.",
      template: "app/site/index.pug"
    }),
    new CopyWebpackPlugin([
      {from: "./app/site/assets/examples", to: "examples"}
    ])
  ]
})
