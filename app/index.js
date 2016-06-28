import "./index.styl"

import Application from "./components/application"

document.addEventListener("DOMContentLoaded", () => {
  const application = new Application()

  application.mount(document.body)
})
