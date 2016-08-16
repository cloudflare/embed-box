/* eslint-env node */

const base = "./modules/"
const privateTargetsPath = "./app/components/targets/"
const publicTargetsPath = "./modules/targets/"
const fs = require("fs")

const targetIDs = exports.targetIDs = fs
  .readdirSync(privateTargetsPath)
  .map(entry => entry.split(".js")[0])
  .filter(id => id !== "index")

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

targetIDs.forEach(id => {
  entries[`embed-box-target-${id}`] = {
    library: `EmbedBox${id}Target`,
    path: `${publicTargetsPath}${id}.js`
  }
})

exports.entries = entries

exports.IDs = Object.keys(exports.entries)
