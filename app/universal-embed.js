import stylesheet from "./universal-embed.styl"
import modalStylesheet from "./iframe.styl"
import pagesStylesheet from "./pages.styl"

import autobind from "autobind-decorator"
import Application from "./components/application"
import store from "./store"
import polyfillCustomEvent from "lib/custom-event"

const {iframe} = store

function unmountElement(element) {
  if (!element || !element.parentNode) return null

  return element.parentNode.removeChild(element)
}

export default class UniversalEmbed {
  static stylesheet = stylesheet;
  static modalStylesheet = modalStylesheet;

  static iframeAttributes = {
    allowTransparency: "",
    "data-universal-embed": "hidden",
    frameBorder: "0",
    seamless: "seamless"
  };

  static pages = [];

  static getPage(id = "") {
    const {pages} = this.constructor

    return pages.filter($ => $.id === id)[0]
  }

  theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  style = document.createElement("style");

  constructor(spec = {}) {
    const {iframeAttributes, stylesheet} = this.constructor

    switch (typeof spec.container) {
      case "object": // Element
        this.container = spec.container
        break

      case "string": // Selector
        this.container = document.querySelector(spec.container)
        break

      default:
        this.container = document.body
    }

    if (!this.container) throw new Error("EagerUniversalEmbed: container was not found.")

    if (spec.theme) {
      this.theme = Object.assign(this.theme, spec.theme)
    }

    this.style.innerHTML = stylesheet
    this.container.appendChild(this.style) // TODO: perhaps always the document.head?

    Object
      .keys(iframeAttributes)
      .forEach(key => iframe.element.setAttribute(key, iframeAttributes[key]))

    this.container.appendChild(iframe.element)

    polyfillCustomEvent(iframe)

    this.appendModalStylesheet()

    const pageStyle = iframe.document.createElement("style")

    pageStyle.innerHTML = pagesStylesheet
    iframe.document.head.appendChild(pageStyle)

    const application = new Application({
      pages: this.constructor.pages,
      onClose: this.hide
    })

    application.mount(iframe.document.body)
  }

  appendModalStylesheet() {
    const {theme, constructor: {modalStylesheet}} = this
    const style = document.createElement("style")

    style.innerHTML = modalStylesheet + `
      body {
        color: ${theme.textColor};
      }

      a, .accent-color {
        color: ${theme.accentColor};
      }

      .button.primary, button.primary,
      [data-component="site-type-search"] .types .type[data-selected],
      .accent-background-color {
        background: ${theme.accentColor};
      }
    `

    iframe.document.head.appendChild(style)
  }

  destroy() {
    unmountElement(iframe.element)
    unmountElement(this.style)
  }

  @autobind
  hide() {
    iframe.element.setAttribute("data-universal-embed", "hidden")

    this.container.style.overflow = this.containerPreviousOverflow
    this.containerPreviousOverflow = ""
  }

  show() {
    iframe.element.setAttribute("data-universal-embed", "visible")

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"
  }
}
