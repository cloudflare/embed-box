import stylesheet from "./eager-universal-embed.styl"
import modalStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import Application from "./components/application"
import store from "./store"

function unmountElement(element) {
  if (!element || !element.parentNode) return null

  return element.parentNode.removeChild(element)
}

export default class EagerUniversalEmbed {
  static stylesheet = stylesheet;
  static modalStylesheet = modalStylesheet;

  static iframeAttributes = {
    allowTransparency: "",
    "data-eager-universal-embed": "hidden",
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

  iframe = document.createElement("iframe");
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
      .forEach(key => this.iframe.setAttribute(key, iframeAttributes[key]))

    this.container.appendChild(this.iframe)

    store.iframe = {
      element: this.iframe,
      document: this.iframe.contentDocument,
      window: this.iframe.contentWindow
    }

    this.appendmodalStylesheet()

    this.init()
    this.show()
  }

  appendmodalStylesheet() {
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
      pages: this.constructor.pages,
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
