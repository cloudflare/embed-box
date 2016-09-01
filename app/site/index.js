import "./site.external-styl"

import {runDemo} from "site/lib/user-simulator"
import loadScripts from "site/lib/load-scripts"
import renderTOC from "site/lib/render-toc"
import renderSupportTable from "site/lib/render-support-table"

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

  window.addEventListener("resize", () => {
    if (!demoInstance) return

    const isDesktop = document.body.clientWidth >= DESKTOP_MIN_WIDTH
    const {mode} = demoInstance

    if (isDesktop && mode === "inline") return
    if (!isDesktop && mode === "modal") return

    demoInstance.destroy()
  })

  function bindObjectArguments(Constructor, boundSpec = {}) {
    return function BoundConstructor(spec) {
      demoInstance = new Constructor({...boundSpec, ...spec})

      return demoInstance
    }
  }

  function loopRunDemo() {
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

  loadScripts(LIBRARY_SCRIPTS, automatedFrameDocument, loopRunDemo)

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
    const example = parentElement.querySelector("code").textContent

    if (demoInstance) {
      demoInstance.destroy()
      demoInstance = null
    }
    stopDemoLoop()

    // Clear previous demo routing.
    if (typeof CONSTRUCTOR_DEFAULTS.routing === "undefined") {
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
    // Prevent first demo from overwriting the URL anchor.
    CONSTRUCTOR_DEFAULTS.routing = false
    CONSTRUCTOR_DEFAULTS.events = {
      onLoad(instance) {
        const instanceElement = instance.application.element

        instanceElement.addEventListener("mouseover", stopDemoLoop)
        instanceElement.addEventListener("click", stopDemoLoop)

        delete CONSTRUCTOR_DEFAULTS.routing
        delete CONSTRUCTOR_DEFAULTS.events
      }
    }
    evalRunButton(buttons[0])
  }
})
