/* eslint-env node */

import EagerUniversalEmbed from "./eager-universal-embed"

const eagerUniversalEmbed = new EagerUniversalEmbed()

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = eagerUniversalEmbed
}
else {
  window.eagerUniversalEmbed = eagerUniversalEmbed
}
