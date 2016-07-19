/* eslint-env node, es6 */

const GenericPage = require("../app/components/pages/generic").default

if (!window) {
  module.exports = GenericPage
}
else if (!window.UniversalEmbedCustom) {
  throw new Error("UniversalEmbedCustom was not found while attaching page `generic`")
}
else {
  window.UniversalEmbedCustom.pages.push(GenericPage)
}

