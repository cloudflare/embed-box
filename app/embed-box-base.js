import stylesheet from "./embed-box.styl"
import iframeStylesheet from "./iframe.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Application from "components/application"
import polyfillCustomEvent from "lib/custom-event"
import polyfillRequestAnimationFrame from "lib/request-animation-frame"
import {createStore} from "lib/store"
import {getRoute, setRoute} from "lib/routing"
import createThemeStylesheet from "lib/create-theme-stylesheet"

const MODE_ATTRIBUTE = "data-mode"
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
  static version = VERSION;

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

  constructor(spec = {}) {
    polyfillRequestAnimationFrame(window)

    const {iframeAttributes, stylesheet} = this.constructor
    const store = createStore(spec)
    const {iframe, routing} = store
    const {
      autoShow = true,
      className = "",
      container = document.body,
      customTargets = [],
      targets: targetConfigs = {}
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

    if (!initialTarget && routing) {
      initialTarget = getRoute()

      if (!visibleTargets.some(({id}) => id === initialTarget)) initialTarget = null
    }

    this.iframe.element.onload = () => {
      // :active style fix for Safari
      iframe.document.addEventListener("touchstart", () => {}, true)

      this._applyTheme(spec.style)
      polyfillCustomEvent(iframe)

      this.application = new Application(this.iframe.document.body, {
        initialTarget,
        onClose: this.hide,
        targets: visibleTargets.map(Target => new Target({config: getConfig(Target)}))
      })

      if (autoShow || this._pendingShow) this.show()

      if (this.events.onLoad) this.events.onLoad.call(this)
    }

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
    iframeElement.setAttribute(MODE_ATTRIBUTE, mode)

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

  _setVisible (willBeVisible) {
    const currentlyVisible = this._visible

    const update = () => {
      this._visible = willBeVisible
      const {element} = this.iframe

      if (willBeVisible) element.style.display = ""

      requestAnimationFrame(() => {
        element.style.opacity = willBeVisible ? 1 : 0
        element.setAttribute(VISIBILITY_ATTRIBUTE, willBeVisible ? "visible" : "hidden")

        if (this.events.visibilityChange) this.events.visibilityChange.call(this, willBeVisible)
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
  _handleTransitionEnd(event) {
    if (event.target !== this.iframe.element) return

    const iframeElement = this.iframe.element

    if (this.visible) {
      this._syncScrollState(this.visible)
    }
    else {
      iframeElement.style.display = "none"
      setRoute("")
    }
  }

  _applyTheme(extension = "") {
    const {iframeStylesheet} = this.constructor
    const {theme} = this._store
    const style = this.iframe.document.createElement("style")

    style.innerHTML = [iframeStylesheet, createThemeStylesheet(theme), extension].join(" ")

    this.iframe.document.head.appendChild(style)
  }

  destroy() {
    this.destroyed = true
    this._setVisible(false)

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

    this._setVisible(false)
  }

  @autobind
  show() {
    if (!this.application) {
      this._pendingShow = true
      return
    }

    if (this.visible) return

    this._setVisible(true)

    this.application.autofocus()
  }
}
