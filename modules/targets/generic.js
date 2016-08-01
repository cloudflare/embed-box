/* eslint-env node, es6 */

const GenericTarget = require("../../app/components/targets/generic").default

if (!window) {
  module.exports = GenericTarget
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `generic`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(GenericTarget)
}

