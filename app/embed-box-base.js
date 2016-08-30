import stylesheet from "./embed-box.styl"
import iframeStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Application from "components/application"
import polyfillCustomEvent from "lib/custom-event"
import polyfillRequestAnimationFrame from "lib/request-animation-frame"
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
    srcdoc: "<div data-iframe-loader-shim style='display: none;'></div>",
    src: "about:blank"
  };

  static theme = {
    accentColor: "#2d88f3",
    backgroundColor: "#ffffff",
    textColor: "#000000"
  };

  constructor(spec = {}) {
    polyfillRequestAnimationFrame(window)

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

    iframe.element.className = `embed-box ${className}`
    iframe.element.style.display = "none"
    iframe.element.addEventListener("transitionend", this.handleTransitionEnd)

    Object.assign(this, {
      destroyed: false,
      _visible: false,
      iframe,
      container,
      events: spec.events || {},
      theme: {...this.constructor.theme, ...theme},
      style: document.createElement("style")
    })

    this.style.innerHTML = stylesheet
    document.head.appendChild(this.style)

    const getConfig = ({id}) => targetConfigs[id] || {}
    const targetConstructors = customTargets.concat(this.constructor.fetchedTargets)
    const visibleTargets = targetConstructors
      .filter(Target => {
        const config = getConfig(Target)

        return config.priority !== -1 && Target.isConstructable(config, store)
      })
      .sort((a, b) => {
        const priorityA = getConfig(a).priority
        const priorityB = getConfig(b).priority
        const aDefined = typeof priorityA === "number"
        const bDefined = typeof priorityB === "number"

        if (aDefined && bDefined) return priorityA - priorityB // Explicit priority between targets
        else if (aDefined) return -1
        else if (bDefined) return 1

        return 0 // Implicit priority from fetchedTargets
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

    const onLoad = () => {
      this.appendIframeStylesheet(spec.style)
      polyfillCustomEvent(iframe)

      this.application = new Application(this.iframe.document.body, {
        initialTarget,
        routing,
        onClose: this.hide,
        targets: visibleTargets.map(Target => new Target({config: getConfig(Target)}))
      })

      if (autoShow || this._pendingShow) this.show()

      if (this.events.onLoad) this.events.onLoad(this)
    }

    this.iframe.element.onload = onLoad
    this.container.appendChild(iframe.element) // iframe window & document is now accessible.
  }

  get container() {
    return this._container
  }

  set container(value) {
    const iframeElement = this.iframe.element

    this._container = typeof value === "string" ? document.querySelector(value) : value
    const mode = this._container.tagName === "BODY" ? "modal" : "inline"

    this._store.mode = mode
    iframeElement.setAttribute("data-mode", mode)

    if (iframeElement.parentNode) {
      this.resetOverflow()
      this._container.appendChild(iframeElement)
    }

    return this._container
  }

  get mode() {
    return this._store.mode
  }

  get _store() {
    return BaseComponent.prototype.store || {}
  }

  get visible () {
    return this._visible
  }

  set visible (visible) {
    this._visible = visible
    const {element} = this.iframe

    if (visible) element.style.display = ""

    requestAnimationFrame(() => {
      element.style.opacity = visible ? 1 : 0
      element.setAttribute(VISIBILITY_ATTRIBUTE, visible ? "visible" : "hidden")

      if (this.events.visibilityChange) this.events.visibilityChange(visible)
    })

    return visible
  }

  @autobind
  handleTransitionEnd() {
    const iframeElement = this.iframe.element

    if (!this.visible) iframeElement.style.display = "none"
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
    this.destroyed = true

    Array
      .from(document.querySelectorAll(".embed-box-download-iframe"))
      .forEach(removeElement)

    removeElement(this.iframe.element)
    removeElement(this.style)

    storeReceivers.forEach(Receiver => delete Receiver.prototype.store)

    this.resetOverflow()
  }

  resetOverflow() {
    this.container.style.overflow = this.containerPreviousOverflow
    this.containerPreviousOverflow = ""
  }

  @autobind
  hide() {
    if (!this.visible) return

    this.visible = false

    this.resetOverflow()
  }

  @autobind
  show() {
    if (!this.application) {
      this._pendingShow = true
      return
    }

    if (this.visible) return

    this.visible = true

    this.containerPreviousOverflow = this.container.style.overflow
    this.container.style.overflow = "hidden"

    this.application.autofocus()
  }
}
