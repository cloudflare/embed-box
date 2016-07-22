import "babel-polyfill"
import "./site.external-styl"

import {getStore} from "lib/store"

import EmbedBox from "../embed-box"
import EmbedBoxCustom from "../custom"
import EmbedBoxCustomPage from "../custom-page"

document.addEventListener("DOMContentLoaded", () => {
  const exampleFrame = document.querySelector(".floating-figure > .example-frame")

  function wrap(Constructor) {
    return function WrappedConstructor(spec = {}) {
      spec.parentDocument = exampleFrame.contentDocument

      return new Constructor(spec)
    }
  }

  Object.assign(exampleFrame.contentWindow, {
    EmbedBox: wrap(EmbedBox),
    EmbedBoxCustom: wrap(EmbedBoxCustom),
    EmbedBoxCustomPage
  })


  function handleRunClick({target}) {
    const {instance} = getStore() || {}
    const {innerText: example} = target.parentElement.querySelector("code")

    if (instance) instance.destroy()

    exampleFrame.contentWindow.eval(example) // eslint-disable-line no-eval
  }

  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
