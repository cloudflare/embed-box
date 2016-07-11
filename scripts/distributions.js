/* eslint-env node */

exports.entries = {
  "universal-embed": {
    library: "UniversalEmbed",
    path: "./universal-embed.js"
  },
  "universal-embed-custom": {
    library: "UniversalEmbedCustom",
    path: "./custom.js"
  },
  "universal-embed-custom-page": {
    library: "UniversalEmbedCustomPage",
    path: "./custom-page.js"
  },
  "universal-embed-page-drupal": {
    library: "UniversalEmbedDrupalPage",
    path: "./pages/drupal.js"
  },
  "universal-embed-page-embed": {
    library: "UniversalEmbedEmbedPage", // TODO: Pick a different name.
    path: "./pages/embed.js"
  },
  "universal-embed-page-joomla": {
    library: "UniversalEmbedWordpressPage",
    path: "./pages/joomla.js"
  },
  "universal-embed-page-wordpress": {
    library: "UniversalEmbedWordpressPage",
    path: "./pages/wordpress.js"
  }
}

exports.IDs = Object.keys(exports.entries)
