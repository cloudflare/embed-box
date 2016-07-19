/* eslint-env node */

const NODE_ENV = process.env.NODE_ENV || "development"
const {routes} = require("../package.json")
const {hostname, protocol} = routes[NODE_ENV]
const siteConfig = require("../webpack.config.site")
const validate = require("./validate")
const webpack = require("webpack")

const compiler = webpack(siteConfig)

compiler.run((fatalError, stats) => {
  validate(fatalError, stats)

  console.log(`- EmbedBox Documentation ${protocol}://${hostname}`)
})
