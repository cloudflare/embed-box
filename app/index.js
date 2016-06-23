import "./index.styl"

import Vue from "vue"
import * as spec from "./components/spec"
import * as components from "./components"

document.addEventListener("DOMContentLoaded", () => {
  Vue.use(components)
  const app = new Vue(spec)

  if (process.env !== "production") window.app = app
})
