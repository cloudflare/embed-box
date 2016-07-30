/* eslint-env node, es6 */

const EmbedBoxBase = require("./app/embed-box-base").default
const targets = require("./app/components/targets")

module.exports = function EmbedBox(spec = {}, ...args) {
  spec.targets = spec.targets || []

  spec.targets.push(
    targets.wordpress,
    targets.drupal,
    targets.joomla,
    targets.generic)

  return new EmbedBoxBase(spec, ...args)
}
