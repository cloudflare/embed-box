/* eslint-env node, es6 */

const UniversalEmbedBase = require("./app/universal-embed").default
const pages = require("./app/components/pages")

module.exports = function UniversalEmbed(spec = {}, ...args) {
  spec.pages = spec.pages || []

  spec.pages.push(
    pages.wordpress,
    pages.drupal,
    pages.joomla,
    pages.generic)

  return new UniversalEmbedBase(spec, ...args)
}
