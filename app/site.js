import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"

import UniversalEmbed from "../universal-embed"
import UniversalEmbedCustom from "../custom"
import UniversalEmbedCustomPage from "../custom-page"

Object.assign(window, {UniversalEmbed, UniversalEmbedCustom, UniversalEmbedCustomPage})

function handleRunClick({target}) {
  const {instance} = getStore() || {}
  const {innerText: example} = target.parentElement.querySelector("code")

  if (instance) instance.destroy()

  eval(example) // eslint-disable-line no-eval
}

document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector("svg.stars")

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
