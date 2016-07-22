/* eslint-env node, es6 */

const JoomlaPage = require("../app/components/pages/joomla").default

if (!window) {
  module.exports = JoomlaPage
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching page `joomla`")
}
else {
  window.EmbedBoxCustom.fetchedPages.push(JoomlaPage)
}

