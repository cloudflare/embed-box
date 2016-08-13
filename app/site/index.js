import "babel-polyfill"
import "./site.external-styl"

import {runDemo} from "lib/user-simulator"
import createSticky from "stickyfill"

const LIBRARY_SCRIPTS = [
  "./embed-box.js",
  "./embed-box-custom.js",
  "./embed-box-custom-target.js"
]

const CONSTRUCTOR_DEFAULTS = {}

function loadDemoScripts(document, onComplete = () => {}) {
  let {length} = LIBRARY_SCRIPTS

  function onload() {
    length--
    if (length === 0) onComplete()
  }

  LIBRARY_SCRIPTS.forEach(src => {
    const script = document.createElement("script")

    Object.assign(script, {src, onload})
    document.head.appendChild(script)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const sticky = createSticky()
  const toc = document.querySelector(".table-of-contents")
  const docsNav = document.querySelector(".docs-nav > .sticky")
  const demoWrapper = document.querySelector(".demo-wrapper > .sticky")

  Array
    .from(document.querySelectorAll("h2.headline-with-anchor [name], h3.headline-with-anchor [name]"))
    .forEach(({parentNode, href, textContent}) => {
      const ul = parentNode.tagName === "H3" ? toc.lastChild.lastChild : toc
      const li = document.createElement("li")
      const a = document.createElement("a")

      Object.assign(a, {href, textContent})

      li.appendChild(a)
      ul.appendChild(li)

      if (parentNode.tagName === "H2") {
        const nextUl = document.createElement("ul")

        li.appendChild(nextUl)
      }
    })

  sticky.add(docsNav)
  sticky.add(demoWrapper)

  const targetIDExample = document.querySelector("[data-example-id='target-ids'] .hljs-comment")

  targetIDExample.textContent = targetIDExample.textContent
    .replace("{{TARGET_IDS}}", `[${window.EmbedBox.getTargetIDs().join(", ")}]`)

  const PRISTINE_GLOBALS = window.PRISTINE_GLOBALS = {
    EmbedBox: window.EmbedBox,
    EmbedBoxCustom: window.EmbedBoxCustom
  }
  const automatedFrame = document.getElementById("automated-frame")
  const runInlineContainer = document.getElementById("run-inline-container")
  let demoInstance = null
  let createInteractiveDemo

  function bindObjectArguments(Constructor, boundSpec = {}) {
    return function BoundConstructor(spec) {
      demoInstance = new Constructor({...boundSpec, ...spec})

      return demoInstance
    }
  }

  function loopRunDemo() {
    createInteractiveDemo = runDemo(automatedFrame, loopRunDemo)
  }

  loadDemoScripts(automatedFrame.contentDocument, loopRunDemo)

  function stopDemoLoop() {
    if (createInteractiveDemo) {
      // The hero automated demo takes focus from other inputs.
      // Switching to the interactive demo prevents this.
      createInteractiveDemo()
      createInteractiveDemo = null
    }
  }

  function evalRunButton(button) {
    const {parentElement} = button
    const useModal = button.getAttribute("data-run") === "modal"
    const example = parentElement.querySelector("code").innerText

    if (demoInstance) demoInstance.destroy()
    stopDemoLoop()

    // Clear previous demo routing.
    if (typeof CONSTRUCTOR_DEFAULTS.routing !== "undefined") {
      window.history.pushState("", "", window.location.pathname)
    }

    CONSTRUCTOR_DEFAULTS.container = useModal ? document.body : runInlineContainer

    Object.keys(PRISTINE_GLOBALS).forEach(key => {
      window[key] = bindObjectArguments(PRISTINE_GLOBALS[key], CONSTRUCTOR_DEFAULTS)
    })
    window.eval(example) // eslint-disable-line no-eval
  }

  const buttons = Array.from(document.querySelectorAll("button[data-run]"))

  buttons.forEach(element => element.addEventListener("click", evalRunButton.bind(null, element)))

  // Prevent first demo from overwriting the URL anchor.
  CONSTRUCTOR_DEFAULTS.routing = false
  evalRunButton(buttons[0])
  delete CONSTRUCTOR_DEFAULTS.routing

  const instanceElement = demoInstance.application.element

  instanceElement.addEventListener("mouseover", stopDemoLoop)
  instanceElement.addEventListener("click", stopDemoLoop)
})
