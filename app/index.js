/* eslint-env node, es6 */

const EagerUniversalEmbed = require("./eager-universal-embed")
const Page = require("./page")

const defaultPages = [
  {label: "WordPress", id: "wordpress"},
  {label: "Drupal", id: "drupal"},
  {label: "Joomla", id: "joomla"},
  {label: "Another CMS", id: "embed", fallback: true}
]

EagerUniversalEmbed.pages = defaultPages.map(spec => new Page(spec))

module.exports = EagerUniversalEmbed
