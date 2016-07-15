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

  application = null;

  theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  style = document.createElement("style");

  constructor(spec = {}) {
    const {iframeAttributes, stylesheet} = this.constructor

    this.container = document.body

    if (spec.theme) {
      this.theme = Object.assign(this.theme, spec.theme)
    }

    this.style.innerHTML = stylesheet
    document.head.appendChild(this.style)

    Object
      .keys(iframeAttributes)
      .forEach(key => iframe.element.setAttribute(key, iframeAttributes[key]))

    this.container.appendChild(iframe.element)

    polyfillCustomEvent(iframe)

    this.appendModalStylesheet()

    const pageStyle = iframe.document.createElement("style")

    pageStyle.innerHTML = pagesStylesheet
    iframe.document.head.appendChild(pageStyle)

    this.application = new Application(iframe.document.body, {
      pages: this.constructor.pages,
      onClose: this.hide
    })
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

  @autobind
  show() {
    iframe.element.setAttribute("data-universal-embed", "visible")

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"

    this.application.autofocus()
  }
}
