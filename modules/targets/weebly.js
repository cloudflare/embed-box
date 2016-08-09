/* eslint-env node, es6 */

const WeeblyTarget = require("../../app/components/targets/weebly").default

if (!window) {
  module.exports = WeeblyTarget
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `weebly`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(WeeblyTarget)
}

