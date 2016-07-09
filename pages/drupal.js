/* eslint-env node, es6 */

const DrupalPage = require("../app/components/pages/drupal").default

if (!window) {
  module.exports = DrupalPage
}
else if (!window.UniversalEmbedCustom) {
  throw new Error("UniversalEmbedCustom was not found while attaching page `drupal`")
}
else {
  window.UniversalEmbedCustom.pages.push(DrupalPage)
}

