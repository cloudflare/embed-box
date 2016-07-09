/* eslint-env node, es6 */

const EmbedPage = require("../app/components/pages/embed").default

if (!window) {
  module.exports = EmbedPage
}
else if (!window.UniversalEmbedCustom) {
  throw new Error("UniversalEmbedCustom was not found while attaching page `embed`")
}
else {
  window.UniversalEmbedCustom.pages.push(EmbedPage)
}

