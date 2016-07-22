/* eslint-env node */

exports.entries = {
  "embed-box": {
    library: "EmbedBox",
    path: "./embed-box.js"
  },
  "embed-box-custom": {
    library: "EmbedBoxCustom",
    path: "./custom.js"
  },
  "embed-box-custom-page": {
    library: "EmbedBoxCustomPage",
    path: "./custom-page.js"
  },
  "embed-box-page-drupal": {
    library: "EmbedBoxDrupalPage",
    path: "./pages/drupal.js"
  },
  "embed-box-page-generic": {
    library: "EmbedBoxGenericPage",
    path: "./pages/generic.js"
  },
  "embed-box-page-joomla": {
    library: "EmbedBoxWordpressPage",
    path: "./pages/joomla.js"
  },
  "embed-box-page-wordpress": {
    library: "EmbedBoxWordpressPage",
    path: "./pages/wordpress.js"
  }
}

exports.IDs = Object.keys(exports.entries)
