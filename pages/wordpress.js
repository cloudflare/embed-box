/* eslint-env node, es6 */

const WordpressPage = require("../app/components/pages/wordpress").default

if (!window) {
  module.exports = WordpressPage
}
else if (!window.UniversalEmbedCustom) {
  throw new Error("UniversalEmbedCustom was not found while attaching page `wordpress`")
}
else {
  window.UniversalEmbedCustom.pages.push(WordpressPage)
}

