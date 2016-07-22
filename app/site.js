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

  const figure = document.querySelector(".floating-figure")
  const iframe = document.createElement("iframe")
  const script = document.createElement("script")

  figure.appendChild(iframe)
  iframe.contentWindow.UniversalEmbed = UniversalEmbed // TODO - make this work
  iframe.contentWindow.eval(example) // eslint-disable-line no-eval
}

document.addEventListener("DOMContentLoaded", () => {
  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
