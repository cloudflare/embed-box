import "./index.styl"

import Application from "./components/application"
import store from "./store"

const style = document.createElement("style")

document.addEventListener("DOMContentLoaded", () => {
  style.innerHTML = `
    a {
      color: ${store.accentColor}
    }
  `

  document.head.appendChild(style)

  const application = new Application()

  application.mount(document.body)
})
