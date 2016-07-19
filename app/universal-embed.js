import stylesheet from "./universal-embed.styl"
import modalStylesheet from "./iframe.styl"
import pagesStylesheet from "./pages.styl"

import autobind from "autobind-decorator"
import Application from "components/application"
import polyfillCustomEvent from "lib/custom-event"
import {initializeStore} from "lib/store"

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

  application = null;

  pages = [];

  style = document.createElement("style");

  theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  constructor(spec = {}) {
    const store = initializeStore(this, spec)

    const {iframe} = store
    const {iframeAttributes, stylesheet} = this.constructor

    Object
      .keys(iframeAttributes)
      .forEach(key => iframe.element.setAttribute(key, iframeAttributes[key]))

    this.container = document.body
    this.container.appendChild(iframe.element)

    polyfillCustomEvent(iframe)

    const pageStyle = iframe.document.createElement("style")

    pageStyle.innerHTML = pagesStylesheet
    iframe.document.head.appendChild(pageStyle)

    this.iframe = iframe

    if (spec.pages) this.pages = spec.pages
    if (spec.theme) Object.assign(this.theme, spec.theme)

    this.style.innerHTML = stylesheet
    document.head.appendChild(this.style)

    this.appendModalStylesheet()

    this.application = new Application(this.iframe.document.body, {
      pages: this.pages,
      onClose: this.hide
    })
  }

  appendModalStylesheet() {
    const {theme, constructor: {modalStylesheet}} = this
    const style = this.iframe.document.createElement("style")

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

    this.iframe.document.head.appendChild(style)
  }

  destroy() {
    unmountElement(this.iframe.element)
    unmountElement(this.style)
  }

  @autobind
  hide() {
    this.iframe.element.setAttribute("data-universal-embed", "hidden")

    this.container.style.overflow = this.containerPreviousOverflow
    this.containerPreviousOverflow = ""
  }

  @autobind
  show() {
    this.iframe.element.setAttribute("data-universal-embed", "visible")

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"

    this.application.autofocus()
  }
}
