const fs = require("fs")

function targetModuleInitializerContent(id) {
  return `/* /!\\ This file is generated. Changes will not persist! /!\\ *\\
/* eslint-env node, es6 */

const Target = require("../../app/components/targets/${id}").default

if (!window) {
  module.exports = Target
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching target \`${id}\`")
}
else {
  window.EmbedBoxCustom.fetchedTargets.push(Target)
}\n`
}

function targetNodeModuleContent(id) {
  return `/* /!\\ This file is generated. Changes will not persist! /!\\ *\\
/* eslint-env node, es6 */
module.exports = require("../dist/embed-box-target-${id}")\n`
}

// const publicTargetsPath = "./modules/targets/"

module.exports = function generateTargetModule(id) {
  fs.writeFileSync(`./modules/targets/${id}.js`, targetModuleInitializerContent(id))
  fs.writeFileSync(`./targets/${id}.js`, targetNodeModuleContent(id))
}
