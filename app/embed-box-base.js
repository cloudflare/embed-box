import stylesheet from "./embed-box.styl"
import iframeStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Application from "components/application"
import polyfillCustomEvent from "lib/custom-event"
import {createStore} from "lib/store"
import {getRoute} from "lib/routing"

const VISIBILITY_ATTRIBUTE = "data-visibility"
let storeReceivers

function removeElement(element) {
  if (!element || !element.parentNode) return null

  return element.parentNode.removeChild(element)
}

export default class EmbedBoxBase {
  static stylesheet = stylesheet;
  static iframeStylesheet = iframeStylesheet;

  static fetchedTargets = [];

  static getTargetIDs() {
    return this.fetchedTargets.map(target => target.id)
  }

  static iframeAttributes = {
    allowTransparency: "",
    [VISIBILITY_ATTRIBUTE]: "hidden",
    frameBorder: "0",
    seamless: "seamless"
  };

  static theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  constructor(spec = {}) {
    const {iframeAttributes, stylesheet} = this.constructor
    const store = createStore(spec)
    const {iframe} = store
    const {
      autoShow = true,
      className = "",
      container = document.body,
      customTargets = [],
      routing = true,
      targets: targetConfigs = {},
      theme = {}
    } = spec


    // HACK: Custom targets have a different BaseComponent instance.
    // This ensures all components have access to the store.
    storeReceivers = [BaseComponent, ...customTargets]

    storeReceivers.forEach(Receiver => {
      Object.defineProperty(Receiver.prototype, "store", {
        configurable: true,
        get() { return store }
      })
    })

    Object
      .keys(iframeAttributes)
      .forEach(key => iframe.element.setAttribute(key, iframeAttributes[key]))

    this.container = typeof container === "string" ? document.querySelector(container) : container
    store.mode = this.container.tagName === "BODY" ? "modal" : "inline"

    iframe.element.className = `embed-box ${className}`
    iframe.element.setAttribute("data-mode", store.mode)
    iframe.element.addEventListener("transitionend", this.handleTransitionEnd)

    this.iframe = iframe
    this.events = spec.events || {}
    this.theme = {...this.constructor.theme, ...theme}
    this.style = document.createElement("style")

    this.style.innerHTML = stylesheet
    document.head.appendChild(this.style)

    const getConfig = ({id}) => targetConfigs[id] || {}
    const targetConstructors = customTargets.concat(this.constructor.fetchedTargets)
    const visibleTargets = targetConstructors
      .filter(Target => {
        const config = getConfig(Target)

        return config.order !== -1 && Target.isConstructable(config, store)
      })
      .sort((a, b) => {
        const orderA = getConfig(a).order
        const orderB = getConfig(b).order
        const aDefined = typeof orderA === "number"
        const bDefined = typeof orderB === "number"

        if (aDefined && bDefined) return orderA - orderB // Explicit order between targets
        else if (aDefined) return -1
        else if (bDefined) return 1

        return 0 // Implicit order from fetchedTargets
      })

    if (visibleTargets.length === 0) {
      console.error([
        "EmbedBox: No targets were constructable.",
        "Is `embedCode` or `pluginURL` specified?"
      ].join(" "), spec)
    }

    let {initialTarget} = spec

    if (!initialTarget) {
      initialTarget = getRoute()

      if (!visibleTargets.some(({id}) => id === initialTarget)) initialTarget = null
    }

    this.iframe.element.onload = () => {
      this.appendIframeStylesheet(spec.style)
      polyfillCustomEvent(iframe)

      this.application = new Application(this.iframe.document.body, {
        initialTarget,
        routing,
        onClose: this.hide,
        targets: visibleTargets.map(Target => new Target({config: getConfig(Target)}))
      })

      if (autoShow) this.show()
    }

    this.container.appendChild(iframe.element) // iframe window & document is now accessible.
  }

  get visibility () {
    return this.iframe.element.getAttribute(VISIBILITY_ATTRIBUTE)
  }

  set visibility (value) {
    const {element} = this.iframe

    element.style.display = value === "hidden" ? "none" : ""
    this.iframe.element.setAttribute(VISIBILITY_ATTRIBUTE, value)

    if (this.events.visibilityChange) this.events.visibilityChange(value)

    return value
  }

  @autobind
  handleTransitionEnd() {
    if (this.visibility === "hiding") this.visibility = "hidden"
    else if (this.visibility === "showing") this.visibility = "shown"
  }

  appendIframeStylesheet(extension = "") {
    const {theme, constructor: {iframeStylesheet}} = this
    const style = this.iframe.document.createElement("style")

    style.innerHTML = iframeStylesheet + `
      [data-component="application"] .modal {
        background-color: ${theme.backgroundColor} !important;
        color: ${theme.textColor} !important;
      }

      a, .accent-color {
        color: ${theme.accentColor} !important;
      }

      .button.primary, button.primary,
      [data-component="target-search"] .entries .entry[data-selected],
      .accent-background-color {
        background: ${theme.accentColor} !important;
      }

      .instructions .steps li:before {
        background: ${theme.accentColor} !important;
      }
    ` + extension

    this.iframe.document.head.appendChild(style)
  }

  destroy() {
    Array
      .from(document.querySelectorAll(".embed-box-download-iframe"))
      .forEach(removeElement)

    removeElement(this.iframe.element)
    removeElement(this.style)

    storeReceivers.forEach(Receiver => delete Receiver.prototype.store)

    this.container.style.overflow = this.containerPreviousOverflow
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
    const {mode} = BaseComponent.prototype.store

    this.visibility = mode === "inline" ? "shown" : "showing"

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"

    this.application.autofocus()
  }
}
