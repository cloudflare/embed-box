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
  const docs = document.querySelector(".slide.docs")
  const docsFloatingFigure = docs.querySelector(".floating-figure")

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

  const floatingFigurePadding = 100
  window.addEventListener("scroll", function(){
    const offset = window.scrollY - (docs.offsetTop + floatingFigurePadding)
    if (offset > 0) {
      docsFloatingFigure.style.top = offset + (floatingFigurePadding * 2) + 'px'
    } else {
      docsFloatingFigure.style.cssText = ''
    }
  })
})
