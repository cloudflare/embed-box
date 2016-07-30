import stylesheet from "./embed-box.styl"
import modalStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import Application from "components/application"
import polyfillCustomEvent from "lib/custom-event"
import {destroyStore, initializeStore} from "lib/store"

const STATE_ATTRIBUTE = "data-embed-box"

function removeElement(element) {
  if (!element || !element.parentNode) return null

  return element.parentNode.removeChild(element)
}

export default class EmbedBoxBase {
  static stylesheet = stylesheet;
  static modalStylesheet = modalStylesheet;

  static iframeAttributes = {
    allowTransparency: "",
    [STATE_ATTRIBUTE]: "hidden",
    frameBorder: "0",
    seamless: "seamless"
  };

  static theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  constructor(spec = {}) {
    const {autoShow = true} = spec
    const {iframeAttributes, stylesheet, theme} = this.constructor
    const store = initializeStore(this, spec)
    const {iframe} = store

    Object
      .keys(iframeAttributes)
      .forEach(key => iframe.element.setAttribute(key, iframeAttributes[key]))

    this.container = document.body
    this.container.appendChild(iframe.element)

    polyfillCustomEvent(iframe)

    iframe.element.addEventListener("transitionend", this.handleTransitionEnd)

    this.iframe = iframe
    this.theme = {...theme, ...(spec.theme || {})}
    this.style = document.createElement("style")

    this.style.innerHTML = stylesheet
    document.head.appendChild(this.style)

    this.appendModalStylesheet()

    this.application = new Application(this.iframe.document.body, {
      onClose: this.hide,
      targets: spec.targets || []
    })

    if (autoShow) this.show()
  }

  get visibility () {
    return this.iframe.element.getAttribute(STATE_ATTRIBUTE)
  }

  set visibility (value) {
    const {element} = this.iframe

    element.style.display = value === "hidden" ? "none" : ""

    return this.iframe.element.setAttribute(STATE_ATTRIBUTE, value)
  }

  @autobind
  handleTransitionEnd() {
    if (this.visibility === "hiding") this.visibility = "hidden"
    else if (this.visibility === "showing") this.visibility = "shown"
  }

  appendModalStylesheet() {
    const {theme, constructor: {modalStylesheet}} = this
    const style = this.iframe.document.createElement("style")

    style.innerHTML = modalStylesheet + `
      [data-component="application"] .modal {
        background-color: ${theme.backgroundColor} !important;
        color: ${theme.textColor} !important;
      }

      a, .accent-color {
        color: ${theme.accentColor} !important;
      }

      .button.primary, button.primary,
      [data-component="site-type-search"] .types .type[data-selected],
      .accent-background-color {
        background: ${theme.accentColor} !important;
      }
    `

    this.iframe.document.head.appendChild(style)
  }

  destroy() {
    removeElement(this.iframe.element)
    removeElement(this.style)
    destroyStore()
  }

  // Forces browser to compute transitions on elements inserted in current frame.
  forceLayout(attribute) {
    return getComputedStyle(this.iframe.element)[attribute]
  }

  @autobind
  hide() {
    this.forceLayout("opacity")
    this.visibility = "hiding"

    this.container.style.overflow = this.containerPreviousOverflow
    this.containerPreviousOverflow = ""
  }

  @autobind
  show() {
    this.forceLayout("opacity")

    this.visibility = "showing"

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"

    this.application.autofocus()
  }
}
