/* eslint-env node, es6 */

const WordpressTarget = require("../app/components/targets/wordpress").default

if (!window) {
  module.exports = WordpressTarget
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `wordpress`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(WordpressTarget)
}

