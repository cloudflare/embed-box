import stylesheet from "./application.styl"
import template from "./application.pug"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import {setRoute} from "lib/routing"
import * as icons from "components/icons"
import KM from "lib/key-map"
import TargetSearch from "components/target-search"
import TargetWrapper from "components/target-wrapper"

const AUTO_DOWNLOAD_DELAY = 3000

export default class Application extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  constructor(mountPoint, options) {
    super(options)

    const element = this.compileTemplate()

    const iframeWindow = this.store.iframe.window
    const {closeModalButton, previousButton} = this.refs
    const headerButtons = [closeModalButton, previousButton]

    headerButtons.forEach(button => {
      const id = button.getAttribute("data-action")
      const icon = new icons[id]()

      button.appendChild(icon.render())
    })

    iframeWindow.addEventListener("keyup", this.delgateKeyEvent)
    iframeWindow.addEventListener("keydown", this.handleKeyNavigation)
    iframeWindow.addEventListener("keypress", this.delgateKeyEvent)

    this.element.setAttribute("is-iphone", (!!navigator.userAgent.match(/iPhone/i) || !!navigator.userAgent.match(/iPod/i)) && !!navigator.userAgent.match(/WebKit/i))

    closeModalButton.addEventListener("click", this.closeModal)
    element.addEventListener("click", event => {
      if (event.target === element) this.closeModal()
    })

    previousButton.addEventListener("click", this.navigateToHome)

    this.renderTargetSearch()
    this.renderTargetWrapper()

    if (this.targets.length === 1) {
      this.navigateToTarget(this.targets[0].id)
    }
    else if (options.initialTarget) {
      this.navigateToTarget(options.initialTarget)
    }
    else {
      this.navigateToHome()
    }

    mountPoint.appendChild(this.element)
  }

  get route() {
    return this._route
  }

  set route(value) {
    this._route = value

    if (this.element) {
      this.element.setAttribute("data-route", this._route)
    }

    if (this.routing) {
      setRoute(value === "home" ? "" : value)
    }

    return this._route
  }

  @autobind
  closeModal() {
    if (this.store.mode !== "modal") return

    this.route = ""
    this.onClose()
  }

  @autobind
  delgateKeyEvent(nativeEvent) {
    const {PolyFilledCustomEvent} = this.store.iframe.window
    const receiver = this.refs.content.querySelector("[data-event-receiver]")

    if (!receiver) return

    const delgated = new PolyFilledCustomEvent(`dispatched-${nativeEvent.type}`, {
      detail: {nativeEvent}
    })

    receiver.dispatchEvent(delgated)
  }

  @autobind
  handleKeyNavigation(event) {
    switch (event.keyCode) {
      case KM.esc:
        event.preventDefault()
        this.closeModal()

        break

      case KM.backspace:
        if (this.element.querySelector("input:focus")) break // User is in a text field.

        event.preventDefault()

        if (this.route !== "home") this.navigateToHome()
        break

      default:
        this.delgateKeyEvent(event)
    }
  }

  renderTitle(html) {
    const {title} = this.refs

    title.innerHTML = html

    const titleCharCount = title.textContent.length
    let charLength = "long"

    if (titleCharCount < 40) charLength = "medium"
    if (titleCharCount < 30) charLength = "short"
    if (titleCharCount < 20) charLength = "puny"

    title.setAttribute("data-title-char-length", charLength)
  }

  renderTargetSearch() {
    const {content} = this.refs
    const {firstChild} = content
    const previousTargetSearch = content.querySelector("[data-component='target-search']")
    const targetSearch = new TargetSearch({
      targets: this.targets,
      onSelection: this.setNavigationState,
      onSubmit: selectedId => {
        this.navigateToTarget(selectedId)
      }
    }).render()

    this.renderTitle(this.label("title"))

    if (!firstChild) {
      content.appendChild(targetSearch)
    }
    else if (previousTargetSearch) {
      content.replaceChild(targetSearch, previousTargetSearch)
    }
    else {
      content.insertBefore(targetSearch, firstChild)
    }
  }

  @autobind
  navigateToHome() {
    this.route = "home"
    this.autofocus()
  }

  @autobind
  navigateToTarget(targetId) {
    this.route = targetId
    this.renderTargetWrapper()
  }

  @autobind
  renderTargetWrapper() {
    const {autoDownload} = this.store
    const {content} = this.refs
    const [target] = this.targets.filter(target => target.id === this.route)
    const previousTargetWrapper = content.querySelector("[data-component='target-wrapper']")
    const targetWrapper = !target ? document.createElement("section") : new TargetWrapper({
      onDone: this.closeModal,
      target
    }).render()

    function startDownload() {
      if (!target) return
      if (!autoDownload || !target.pluginURL) return

      setTimeout(target.startDownload, AUTO_DOWNLOAD_DELAY)
    }

    if (!target) {
      targetWrapper.setAttribute("data-component", "target-wrapper")
    }
    else {
      this.renderTitle(target.modalTitle)
    }

    if (previousTargetWrapper) {
      content.replaceChild(targetWrapper, previousTargetWrapper)
    }
    else {
      content.appendChild(targetWrapper)
    }

    startDownload()
  }
}
