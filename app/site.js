import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"

import EmbedBox from "../embed-box"
import EmbedBoxCustom from "../custom"
import EmbedBoxCustomPage from "../custom-page"

Object.assign(window, {EmbedBox, EmbedBoxCustom, EmbedBoxCustomPage})

function handleRunClick({target}) {
  const {instance} = getStore() || {}
  const {innerText: example} = target.parentElement.querySelector("code")

  if (instance) instance.destroy()

  const figure = document.querySelector(".floating-figure")
  const iframe = document.createElement("iframe")
  const script = document.createElement("script")

  figure.appendChild(iframe)
  iframe.contentWindow.EmbedBox = EmbedBox // TODO - make this work
  iframe.contentWindow.eval(example) // eslint-disable-line no-eval
}

document.addEventListener("DOMContentLoaded", () => {
  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
