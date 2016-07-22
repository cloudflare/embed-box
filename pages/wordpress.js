/* eslint-env node, es6 */

const WordpressPage = require("../app/components/pages/wordpress").default

if (!window) {
  module.exports = WordpressPage
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching page `wordpress`")
}
else {
  window.EmbedBoxCustom.fetchedPages.push(WordpressPage)
}

