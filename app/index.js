import "./index.styl"

import Application from "./components/application"
import store from "./store"

const style = document.createElement("style")

document.addEventListener("DOMContentLoaded", () => {
  style.innerHTML = `
    body {
      color: ${store.textColor};
    }

    a {
      color: ${store.accentColor};
    }

    .button.primary, button.primary,
    [data-component="site-type-search"] .types .type[data-selected] {
      background: ${store.accentColor};
    }
  `

  document.head.appendChild(style)

  const application = new Application({
    // TODO: Check IE for custom event constructor support.
    supportsCustomEvents: true
  })

  application.mount(document.body)
})
