/* eslint-env node, es6 */

const DrupalTarget = require("../app/components/targets/drupal").default

if (!window) {
  module.exports = DrupalTarget
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `drupal`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(DrupalTarget)
}

