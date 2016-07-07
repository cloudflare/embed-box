/* eslint-env node */

import stylesheet from "./eager-universal-embed.styl"
import iframeStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import Application from "./components/application"
import store from "./store"

function unmountElement(element) {
  if (!element || !element.parentNode) return null

  return element.parentNode.removeChild(element)
}

module.exports = class EagerUniversalEmbed {
  static stylesheet = stylesheet;
  static iframeStylesheet = iframeStylesheet;

  static iframeAttributes = {
    allowTransparency: "",
    "data-eager-universal-embed": "hidden",
    frameBorder: "0",
    seamless: "seamless"
  };

  iframe = document.createElement("iframe");
  style = document.createElement("style");

  constructor({container} = {}) {
    const {iframeAttributes, stylesheet} = this.constructor

    switch (typeof container) {
      case "object": // Element
        this.container = container
        break

      case "string": // Selector
        this.container = document.querySelector(container)
        break

      default:
        this.container = document.body
    }

    if (!this.container) throw new Error("EagerUniversalEmbed: container was not found.")

    this.style.innerHTML = stylesheet
    this.container.appendChild(this.style) // TODO: perhaps always the document.head?

    Object
      .keys(iframeAttributes)
      .forEach(key => this.iframe.setAttribute(key, iframeAttributes[key]))

    this.container.appendChild(this.iframe)

    store.iframe = {
      element: this.iframe,
      document: this.iframe.contentDocument,
      window: this.iframe.contentWindow
    }

    this.appendIframeStylesheet()

    this.init()
    this.show()
  }

  appendIframeStylesheet() {
    const {iframeStylesheet} = this.constructor
    const style = document.createElement("style")

    style.innerHTML = iframeStylesheet + `
      body {
        color: ${store.textColor};
      }

      a, .accent-color {
        color: ${store.accentColor};
      }

      .button.primary, button.primary,
      [data-component="site-type-search"] .types .type[data-selected],
      .accent-background-color {
        background: ${store.accentColor};
      }
    `

    this.iframe.contentDocument.head.appendChild(style)
  }

  destroy() {
    unmountElement(this.iframe)
    unmountElement(this.style)
  }

  @autobind
  hide() {
    this.iframe.setAttribute("data-eager-universal-embed", "hidden")

    this.container.style.overflow = this.containerPreviousOverflow
    this.containerPreviousOverflow = ""
  }

  init() {
    const application = new Application({
      onClose: this.hide,
      // TODO: Check IE for custom event constructor support.
      supportsCustomEvents: true
    })

    application.mount(this.iframe.contentDocument.body)
  }

  show() {
    this.iframe.setAttribute("data-eager-universal-embed", "visible")

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"
  }
}
