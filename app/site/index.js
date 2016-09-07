import "./site.external-styl"

import {runDemo} from "site/lib/user-simulator"
import loadScripts from "site/lib/load-scripts"
import renderTOC from "site/lib/render-toc"
import renderSupportTable from "site/lib/render-support-table"
import polyfillCustomEvent from "lib/custom-event"

const DESKTOP_MIN_WIDTH = 1080

const LIBRARY_SCRIPTS = [
  "./embed-box.js",
  "./embed-box-custom.js",
  "./embed-box-custom-target.js"
]

const CONSTRUCTOR_DEFAULTS = {}

document.addEventListener("DOMContentLoaded", () => {
  // :active style fix for Safari
  document.addEventListener("touchstart", () => {}, true)
  polyfillCustomEvent({window, document})

  const targetIDExample = document.querySelector("[data-example-id='target-ids'] .hljs-comment")
  const PRISTINE_GLOBALS = window.PRISTINE_GLOBALS = {
    EmbedBox: window.EmbedBox,
    EmbedBoxCustom: window.EmbedBoxCustom
  }
  const automatedFrame = document.getElementById("automated-frame")
  const automatedFrameDocument = automatedFrame.contentDocument
  const runInlineContainer = document.getElementById("run-inline-container")
  let demoInstance = null
  let createInteractiveDemo

  renderTOC()
  renderSupportTable(window.EmbedBox)

  targetIDExample.textContent = targetIDExample.textContent
    .replace("{{TARGET_IDS}}", `[${window.EmbedBox.getTargetIDs().join(", ")}]`)


  function bindObjectArguments(Constructor, boundSpec = {}) {
    return function BoundConstructor(spec) {
      demoInstance = new Constructor({...boundSpec, ...spec})

      return demoInstance
    }
  }

  function onAutomatedFrameLoaded() {
    function runDemoSequence() {
      createInteractiveDemo = runDemo(automatedFrame, () => {
        createInteractiveDemo()
      })
    }

    const style = automatedFrameDocument.createElement("style")

    style.innerHTML = `
      html, body {
        margin: 0;
        padding: 0;
      }
    `
    automatedFrameDocument.head.appendChild(style)

    loadScripts(LIBRARY_SCRIPTS, automatedFrameDocument, runDemoSequence)
  }

  if (automatedFrameDocument.readyState === "complete") {
    onAutomatedFrameLoaded()
  }
  else {
    automatedFrame.onLoad = onAutomatedFrameLoaded
  }

  function stopAutomatedDemo() {
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
    const example = parentElement.querySelector("code").textContent

    if (demoInstance) {
      demoInstance.destroy()
      demoInstance = null
    }
    stopAutomatedDemo()

    // Clear previous demo routing.
    if (window.history.pushState) {
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

  if (document.body.clientWidth >= DESKTOP_MIN_WIDTH) {
    CONSTRUCTOR_DEFAULTS.events = {
      onLoad() {
        const instanceElement = this.application.element

        instanceElement.addEventListener("mouseover", stopAutomatedDemo)
        instanceElement.addEventListener("click", stopAutomatedDemo)

        delete CONSTRUCTOR_DEFAULTS.events
      }
    }
    evalRunButton(buttons[0])
  }
})
