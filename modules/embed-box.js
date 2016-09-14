/* eslint-env node, es6 */

const EmbedBoxBase = require("../app/embed-box-base").default
const targets = require("../app/targets")
const targetOrder = [
  "wordpress",
  "shopify",
  "squarespace",
  "tumblr",
  "weebly",
  "drupal",
  "joomla",
  "generic"
]

EmbedBoxBase.fetchedTargets = targetOrder.map(id => targets[id])

module.exports = EmbedBoxBase
