/* eslint-env node, es6 */

const UniversalEmbedBase = require("./app/universal-embed").default
const pages = require("./app/components/pages")

module.exports = function UniversalEmbed(spec = {}, ...args) {
  if (!spec.pages) {
    spec.pages = [
      pages.wordpress,
      pages.drupal,
      pages.joomla,
      pages.embed
    ]
  }

  return new UniversalEmbedBase(spec, ...args)
}
