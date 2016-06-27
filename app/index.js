import "./index.styl"

import App from "./components/spec"

document.addEventListener("DOMContentLoaded", () => {
  const app = new App()

  app.mount(document.body)
})
