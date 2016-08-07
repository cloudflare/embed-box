import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"
import {runDemo} from "lib/user-simulator"

const LIBRARY_SCRIPTS = [
  "./embed-box.js",
  "./embed-box-custom.js",
  "./embed-box-custom-target.js"
]

function bindObjectArguments(Constructor, boundSpec = {}) {
  return spec => {
    return new Constructor({...boundSpec, ...spec})
  }
}

function loadDemoScripts(document, onLoad = () => {}) {
  let {length} = LIBRARY_SCRIPTS

  function onScriptLoad() {
    length--
    if (length === 0) onLoad()
  }

  LIBRARY_SCRIPTS.forEach(path => {
    const script = document.createElement("script")

    script.onload = onScriptLoad
    script.src = path
    document.head.appendChild(script)
  })
}

function alignWithElement(element, referenceElement) {
  element.style.top = `${referenceElement.offsetTop}px`
}

document.addEventListener("DOMContentLoaded", () => {
  const PRISTINE_GLOBALS = {
    EmbedBox: window.EmbedBox,
    EmbedBoxCustom: window.EmbedBoxCustom
  }
  const automatedFrame = document.getElementById("automated-frame")
  const exampleContainer = document.getElementById("example-container")
  const docs = document.querySelector(".slide.docs")
  const docsFloatingFigure = docs.querySelector(".floating-figure")
  let createInteractiveDemo

  function loopRunDemo() {
    createInteractiveDemo = runDemo(automatedFrame, loopRunDemo)
  }

  loadDemoScripts(automatedFrame.contentDocument, loopRunDemo)

  function handleRunClick({target}) {
    const {instance: previousInstance} = getStore() || {}
    const {parentElement} = target
    const useModal = target.getAttribute("data-run") === "modal"
    const container = useModal ? document.body : exampleContainer
    const {innerText: example} = parentElement.querySelector("code")

    if (previousInstance) previousInstance.destroy()

    if (createInteractiveDemo) {
      // The hero automated demo takes focus from other inputs.
      // Switching to the interactive demo prevents this.
      createInteractiveDemo()
      createInteractiveDemo = null
    }

    // Demos may alter the constructor and must be reloaded to prevent overlapping changes.
    docsFloatingFigure.style.display = useModal ? "none" : ""
    alignWithElement(docsFloatingFigure, parentElement)

    Object.keys(PRISTINE_GLOBALS).forEach(key => {
      window[key] = bindObjectArguments(PRISTINE_GLOBALS[key], {container})
    })
    window.eval(example) // eslint-disable-line no-eval
  }

  alignWithElement(docsFloatingFigure, docs.querySelector(".code-example.has-run-button"))

  Array
    .from(document.querySelectorAll("button[data-run]"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
