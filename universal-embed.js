/* eslint-env node, es6 */

const UniversalEmbed = require("./app/universal-embed").default
const pages = require("./app/components/pages")

UniversalEmbed.pages = [
  pages.wordpress,
  pages.drupal,
  pages.joomla,
  pages.embed
]

module.exports = UniversalEmbed
