import "babel-polyfill"
import "./site.external-styl"

import * as examples from "./examples"
import drawStars from "lib/draw-stars"
import {getStore} from "lib/store"

function handleRunClick({target}) {
  const {instance} = getStore() || {}

  if (instance) instance.destroy()

  const key = target.getAttribute("data-example")

  examples[key]()
}

document.addEventListener("DOMContentLoaded", () => {
  const svg = document.querySelector("svg.stars")

  drawStars(svg)

  window.addEventListener("resize", () => drawStars(svg))

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
