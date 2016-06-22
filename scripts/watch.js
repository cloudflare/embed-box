/* eslint-env node */

const {routes} = require("../package.json")
const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const config = require("../webpack.config")

const {hostname, port} = routes.development.views

const server = new WebpackDevServer(webpack(config), {
  historyApiFallback: true,
  publicPath: config.output.publicPath,
  stats: {
    assets: true,
    chunks: false,
    chunkModules: false,
    colors: true,
    hash: false,
    timings: true,
    version: false
  }
})

server.listen(port, hostname)
