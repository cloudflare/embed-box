import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"
import {runDemo} from "lib/user-simulator"

const DEMO_FRAME_PATH = "/site-demo-frame.js"

function loadDemoScript({contentDocument}, onLoad = () => {}) {
  const demoScript = contentDocument.createElement("script")

  demoScript.onload = onLoad
  demoScript.src = DEMO_FRAME_PATH
  contentDocument.head.appendChild(demoScript)
}

function alignWithElement(element, referenceElement) {
  element.style.top = `${referenceElement.offsetTop}px`
}

document.addEventListener("DOMContentLoaded", () => {
  const automatedFrame = document.getElementById("automated-frame")
  const exampleFrame = document.getElementById("example-frame")
  const docs = document.querySelector(".slide.docs")
  const docsFloatingFigure = docs.querySelector(".floating-figure")

  loadDemoScript(exampleFrame)
  loadDemoScript(automatedFrame, () => runDemo(automatedFrame))

  function handleRunClick({target: {parentElement}}) {
    const {instance} = getStore(exampleFrame.contentWindow) || {}
    const {innerText: example} = parentElement.querySelector("code")

    if (instance) instance.destroy()

    exampleFrame.contentWindow.eval(example)
    alignWithElement(docsFloatingFigure, parentElement)
  }

  alignWithElement(docsFloatingFigure, docs.querySelector(".code-example.has-run-button"))

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
