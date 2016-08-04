import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"
import {runDemo} from "lib/user-simulator"

const LIBRARY_SCRIPTS = [
  "./embed-box.js",
  "./embed-box-custom.js",
  "./embed-box-custom-target.js"
]

function loadDemoScripts({contentDocument}, onLoad = () => {}) {
  let {length} = LIBRARY_SCRIPTS

  function onScriptLoad() {
    length--
    if (length === 0) onLoad()
  }

  LIBRARY_SCRIPTS.forEach(path => {
    const script = contentDocument.createElement("script")

    script.onload = onScriptLoad
    script.src = path
    contentDocument.head.appendChild(script)
  })
}

function alignWithElement(element, referenceElement) {
  element.style.top = `${referenceElement.offsetTop}px`
}

document.addEventListener("DOMContentLoaded", () => {
  const automatedFrame = document.getElementById("automated-frame")
  const exampleFrame = document.getElementById("example-frame")
  const docs = document.querySelector(".slide.docs")
  const docsFloatingFigure = docs.querySelector(".floating-figure")
  let createInteractiveDemo

  function loopRunDemo() {
    createInteractiveDemo = runDemo(automatedFrame, loopRunDemo)
  }

  loadDemoScripts(exampleFrame)
  loadDemoScripts(automatedFrame, loopRunDemo)

  function handleRunClick({target: {parentElement}}) {
    const {instance} = getStore(exampleFrame.contentWindow) || {}
    const {innerText: example} = parentElement.querySelector("code")

    if (instance) instance.destroy()

    if (createInteractiveDemo) {
      // The hero automated demo takes focus from other inputs.
      // Switching to the interactive demo prevents this.
      createInteractiveDemo()
      createInteractiveDemo = null
    }

    loadDemoScripts(exampleFrame, () => {
      exampleFrame.contentWindow.eval(example)
    })

    alignWithElement(docsFloatingFigure, parentElement)
  }

  alignWithElement(docsFloatingFigure, docs.querySelector(".code-example.has-run-button"))

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
