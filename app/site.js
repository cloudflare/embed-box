import "babel-polyfill"
import "./site.external-styl"

import * as examples from "./examples"
import drawStars from "lib/draw-stars"

function handleRunClick({target}) {
  const key = target.getAttribute("data-example")

  examples[key]()
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.querySelector("canvas.stars")

  drawStars(canvas)

  window.addEventListener("resize", () => drawStars(canvas))

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
