/* eslint-env node, es6 */

const DrupalPage = require("../app/components/pages/drupal").default

if (!window) {
  module.exports = DrupalPage
}
else if (!window.EmbedBoxCustom) {
  throw new Error("EmbedBoxCustom was not found while attaching page `drupal`")
}
else {
  window.EmbedBoxCustom.fetchedPages.push(DrupalPage)
}

