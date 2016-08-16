/* /!\ This file is generated in `generate-target-module` /!\ *\
/* eslint-env node, es6 */

const Target = require("../../app/components/targets/wordpress").default

if (!window) {
  module.exports = Target
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target `wordpress`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(Target)
}
