import "babel-polyfill"
import "./site.external-styl"

import {runDemo} from "lib/user-simulator"
import createSticky from "stickyfill"

const LIBRARY_SCRIPTS = [
  "./embed-box.js",
  "./embed-box-custom.js",
  "./embed-box-custom-target.js"
]

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

  const PRISTINE_GLOBALS = {
    EmbedBox: window.EmbedBox,
    EmbedBoxCustom: window.EmbedBoxCustom
  }
  const automatedFrame = document.getElementById("automated-frame")
  const runInlineContainer = document.getElementById("run-inline-container")
  let demoInstance = null
  let createInteractiveDemo

  function bindObjectArguments(Constructor, boundSpec = {}) {
    return spec => {
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
    const container = useModal ? document.body : runInlineContainer
    const example = parentElement.querySelector("code").innerText

    if (demoInstance) demoInstance.destroy()

    stopDemoLoop()

    // Clear previous demo routing.
    window.history.pushState("", "", window.location.pathname)

    Object.keys(PRISTINE_GLOBALS).forEach(key => {
      window[key] = bindObjectArguments(PRISTINE_GLOBALS[key], {container})
    })
    window.eval(example) // eslint-disable-line no-eval
  }

  const buttons = Array.from(document.querySelectorAll("button[data-run]"))

  buttons.forEach(element => element.addEventListener("click", evalRunButton.bind(null, element)))

  evalRunButton(buttons[0])
  const instanceElement = demoInstance.application.element

  instanceElement.addEventListener("mouseover", stopDemoLoop)
  instanceElement.addEventListener("click", stopDemoLoop)
})
