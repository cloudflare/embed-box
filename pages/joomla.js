/* eslint-env node, es6 */

const JoomlaPage = require("../app/components/pages/joomla").default

if (!window) {
  module.exports = JoomlaPage
}
else if (!window.UniversalEmbedCustom) {
  throw new Error("UniversalEmbedCustom was not found while attaching page `joomla`")
}
else {
  window.UniversalEmbedCustom.pages.push(JoomlaPage)
}

