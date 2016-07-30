/* eslint-env node, es6 */

const EmbedBoxBase = require("./app/embed-box-base").default

function EmbedBoxCustom(spec = {}, ...args) {
  const {fetchedTargets} = this.constructor

  spec.targets = fetchedTargets.concat(spec.targets || [])

  return new EmbedBoxBase(spec, ...args)
}

EmbedBoxCustom.fetchedTargets = []

module.exports = EmbedBoxCustom
