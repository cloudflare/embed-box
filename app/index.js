/* eslint-env node, es6 */

const UniversalEmbed = require("./eager-universal-embed")
const Page = require("./page")

const WordPressPage = require("./pages/wordpress")
const DrupalPage = require("./pages/drupal")
const JoomlaPage = require("./pages/joomla")
const GenericPage = require("./pages/generic")

// {label: "", id: "wordpress"},
// {label: "", id: "drupal"},
// {label: "", id: "joomla"},
// {label: " CMS", id: "embed", fallback: true}

UniversalEmbed.pages = [
  WordPressPage,
  DrupalPage,
  JoomlaPage,
  GenericPage
]

module.exports = UniversalEmbed
