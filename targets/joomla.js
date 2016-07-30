/* eslint-env node, es6 */

const JoomlaTarget = require("../app/components/targets/joomla").default

if (!window) {
  module.exports = JoomlaTarget
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `joomla`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(JoomlaTarget)
}

