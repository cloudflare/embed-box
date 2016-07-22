/* eslint-env node, es6 */

const EmbedBoxBase = require("./app/embed-box-base").default

function EmbedBoxCustom(spec = {}, ...args) {
  const {fetchedPages} = this.constructor

  spec.pages = fetchedPages.concat(spec.pages || [])

  return new EmbedBoxBase(spec, ...args)
}

EmbedBoxCustom.fetchedPages = []

module.exports = EmbedBoxCustom
