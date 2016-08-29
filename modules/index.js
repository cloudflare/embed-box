/* eslint-env node */

const base = "./modules/"

const entries = {
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
  }
}

exports.entries = entries

exports.IDs = Object.keys(exports.entries)
