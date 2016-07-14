import stylesheet from "./site.styl"
import * as examples from "./examples"

const style = document.createElement("style")

style.innerHTML = stylesheet
document.head.appendChild(style)

function handleRunClick({target}) {
  const key = target.getAttribute("data-example")

  examples[key]()
}

document.addEventListener("DOMContentLoaded", () => {
  Array
    .from(document.querySelectorAll("button.run"))
    .forEach(element => element.addEventListener("click", handleRunClick))
})
