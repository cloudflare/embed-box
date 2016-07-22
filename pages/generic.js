/* eslint-env node, es6 */

const GenericPage = require("../app/components/pages/generic").default

if (!window) {
  module.exports = GenericPage
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching page `generic`")
}
else {
  window.EmbedBoxCustom.fetchedPages.push(GenericPage)
}

