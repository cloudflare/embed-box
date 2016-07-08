/* eslint-env node, es6 */

const UniversalEmbed = require("./eager-universal-embed").default
const pages = require("components/pages")

UniversalEmbed.pages = [
  pages.wordpress,
  pages.drupal,
  pages.joomla,
  pages.embed
]

module.exports = UniversalEmbed
