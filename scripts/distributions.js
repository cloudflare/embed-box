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
  "embed-box-custom-target": {
    library: "EmbedBoxCustomTarget",
    path: "./custom-target.js"
  },
  "embed-box-target-drupal": {
    library: "EmbedBoxDrupalTarget",
    path: "./targets/drupal.js"
  },
  "embed-box-target-generic": {
    library: "EmbedBoxGenericTarget",
    path: "./targets/generic.js"
  },
  "embed-box-target-joomla": {
    library: "EmbedBoxWordpressTarget",
    path: "./targets/joomla.js"
  },
  "embed-box-target-wordpress": {
    library: "EmbedBoxWordpressTarget",
    path: "./targets/wordpress.js"
  }
}

exports.IDs = Object.keys(exports.entries)
