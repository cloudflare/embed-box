/* eslint-env node */

const base = "./modules/"

exports.entries = {
  "embed-box": {
    library: "EmbedBox",
    path: base + "embed-box.js"
  },
  "embed-box-custom": {
    library: "EmbedBoxCustom",
    path: base + "custom.js"
  },
  "embed-box-custom-target": {
    library: "EmbedBoxCustomTarget",
    path: base + "custom-target.js"
  },
  "embed-box-target-drupal": {
    library: "EmbedBoxDrupalTarget",
    path: base + "targets/drupal.js"
  },
  "embed-box-target-generic": {
    library: "EmbedBoxGenericTarget",
    path: base + "targets/generic.js"
  },
  "embed-box-target-joomla": {
    library: "EmbedBoxWordpressTarget",
    path: base + "targets/joomla.js"
  },
  "embed-box-target-wordpress": {
    library: "EmbedBoxWordpressTarget",
    path: base + "targets/wordpress.js"
  }
}

exports.IDs = Object.keys(exports.entries)
