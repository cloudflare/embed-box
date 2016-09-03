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
const SCROLL_STATE_ATTRIBUTE = "data-embed-box-scroll-state"
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
    iframe.element.addEventListener("transitionend", this._handleTransitionEnd)

    Object.assign(this, {
      destroyed: false,
      _visible: false,
      _previousContainerScrollPosition: null,
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
      // :active style fix for Safari
      iframe.document.addEventListener("touchstart", () => {}, true)

      this._appendIframeStylesheet(spec.style)
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
      this._container.removeAttribute(SCROLL_STATE_ATTRIBUTE)
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

  set visible (willBeVisible) {
    const currentlyVisible = this._visible

    const update = () => {
      this._visible = willBeVisible
      const {element} = this.iframe

      if (willBeVisible) element.style.display = ""

      requestAnimationFrame(() => {
        element.style.opacity = willBeVisible ? 1 : 0
        element.setAttribute(VISIBILITY_ATTRIBUTE, willBeVisible ? "visible" : "hidden")

        if (this.events.visibilityChange) this.events.visibilityChange(willBeVisible)
      })
    }

    if (this.destroyed && currentlyVisible || !willBeVisible && currentlyVisible) {
      this._syncScrollState(willBeVisible, update)
    }
    else if (!this.destroyed && !currentlyVisible) {
      update()
    }

    return willBeVisible
  }

  _syncScrollState(nextVisible, next = () => {}) {
    // NOTE: The scroll state should be only be synced when the user cannot see
    // the update. Call this method only while the modal is opaque.

    const {container} = this
    const {documentElement} = document
    const nextValue = nextVisible && !this.destroyed ? "locked" : "unlocked"

    const checkLockState = () => {
      if (nextValue === "unlocked") {
        container.scrollTop = this._previousContainerScrollPosition
        this._previousContainerScrollPosition = null
      }

      next()
    }

    if (this.destroyed || this.mode !== "modal") {
      documentElement.removeAttribute(SCROLL_STATE_ATTRIBUTE)
      container.removeAttribute(SCROLL_STATE_ATTRIBUTE)

      requestAnimationFrame(checkLockState)
      return
    }

    if (nextValue === "locked") {
      this._previousContainerScrollPosition = container.scrollTop
    }

    documentElement.setAttribute(SCROLL_STATE_ATTRIBUTE, nextValue)
    container.setAttribute(SCROLL_STATE_ATTRIBUTE, nextValue)

    requestAnimationFrame(checkLockState)
  }

  @autobind
  _handleTransitionEnd() {
    const iframeElement = this.iframe.element

    if (this.visible) {
      this._syncScrollState(this.visible)
    }

    if (!this.visible) iframeElement.style.display = "none"
  }

  _appendIframeStylesheet(extension = "") {
    const {theme, constructor: {iframeStylesheet}} = this
    const style = this.iframe.document.createElement("style")

    const $ = value => `${value} !important`

    style.innerHTML = iframeStylesheet + `
      [data-component="application"] .modal {
        background-color: ${$(theme.backgroundColor)};
        color: ${$(theme.textColor)};
      }

      a, .accent-color {
        color: ${$(theme.accentColor)};
      }

      .button.primary, button.primary,
      [data-component="target-search"] .entries .entry[data-selected],
      [data-component="target-search"] .entries .entry:active,
      .accent-background-color {
        background: ${$(theme.accentColor)};
      }

      .target-instructions .steps li:before {
        background: ${$(theme.accentColor)};
      }
    ` + extension

    this.iframe.document.head.appendChild(style)
  }

  destroy() {
    this.destroyed = true
    this.visible = false

    Array
      .from(document.querySelectorAll(".embed-box-download-iframe"))
      .forEach(removeElement)

    removeElement(this.iframe.element)
    removeElement(this.style)

    storeReceivers.forEach(Receiver => delete Receiver.prototype.store)
  }

  @autobind
  hide() {
    if (!this.visible) return

    this.visible = false
  }

  @autobind
  show() {
    if (!this.application) {
      this._pendingShow = true
      return
    }

    if (this.visible) return

    this.visible = true

    this.application.autofocus()
  }
}
