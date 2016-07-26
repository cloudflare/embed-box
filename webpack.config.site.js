/* eslint-env node */
"use strict"

const createWebpackConfig = require("./webpack.config.base")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const extractCSS = new ExtractTextPlugin("site.css")

module.exports = createWebpackConfig({
  // TODO: It'd be nice if this was fetched from deploy.yaml
  buildDirectory: "site-deploy",

  entry: {
    site: "./app/site.js",
    "site-demo-frame": "./app/site-demo-frame.js"
  },

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
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  },

  plugins: [
    extractCSS,
    new HtmlWebpackPlugin({
      title: "EmbedBox install UI by Eager",
      description: "An open-source UI which makes it easy for your users to install your embed code.",
      template: "app/index.pug"
    })
  ]
})
