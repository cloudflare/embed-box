import "./index.styl"

import React from "react"
import {render} from "react-dom"
import Application from "containers/application"

document.addEventListener("DOMContentLoaded", () => {
  render(<Application />,
  document.querySelector("main"))
})
