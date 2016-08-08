/* eslint-env node */

const base = "./modules/"
const targetsPath = "./modules/targets/"
const fs = require("fs")

const IDs = fs
  .readdirSync(targetsPath)
  .map(entry => entry.split(".js")[0])

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

IDs.forEach(id => {
  entries[`embed-box-target-${id}`] = {
    library: `EmbedBox${id}Target`,
    path: `${targetsPath}${id}.js`
  }
})

exports.entries = entries

exports.IDs = Object.keys(exports.entries)
