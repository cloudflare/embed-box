import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"

const DEMO_FRAME_PATH = "/site-demo-frame.js"

function loadDemoScript({contentDocument}, onLoad = () => {}) {
  const demoScript = contentDocument.createElement("script")

  demoScript.onload = onLoad
  demoScript.src = DEMO_FRAME_PATH
  contentDocument.head.appendChild(demoScript)
}

function runAutomatedDemo({contentWindow}) {
  // TODO flesh out

  return new contentWindow.EmbedBox()
}

document.addEventListener("DOMContentLoaded", () => {
  const automatedFrame = document.getElementById("automated-frame")
  const exampleFrame = document.getElementById("example-frame")

  loadDemoScript(exampleFrame)
  loadDemoScript(automatedFrame, () => {
    runAutomatedDemo(automatedFrame)
  })

  function handleRunClick({target}) {
    const {instance} = getStore(exampleFrame.contentWindow) || {}
    const {innerText: example} = target.parentElement.querySelector("code")

    if (instance) instance.destroy()

    exampleFrame.contentWindow.eval(example) // eslint-disable-line no-eval
  }

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
