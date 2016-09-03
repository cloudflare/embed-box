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

    this._transitioning = false

    const element = this.compileTemplate()

    const iframeWindow = this.store.iframe.window
    const {content, closeModalButton, previousButton} = this.refs
    const headerButtons = [closeModalButton, previousButton]

    headerButtons.forEach(button => {
      const id = button.getAttribute("data-action")
      const icon = new icons[id]()

      button.appendChild(icon.render())
    })

    iframeWindow.addEventListener("keyup", this.delgateKeyEvent)
    iframeWindow.addEventListener("keydown", this.handleKeyNavigation)
    iframeWindow.addEventListener("keypress", this.delgateKeyEvent)

    closeModalButton.addEventListener("click", this.closeModal)
    element.addEventListener("click", event => {
      if (event.target === element) this.closeModal()
    })

    previousButton.addEventListener("click", this.navigateToHome)

    if (this.targets.length === 1) {
      this.route = this.targets[0].id
      this.navigateToTarget()
    }
    else if (options.initialTarget) {
      this.route = options.initialTarget
      this.navigateToTarget()
    }
    else {
      this.route = "home"
      this.navigateToHome()
    }

    mountPoint.appendChild(this.element)

    content.addEventListener("transitionend", this.handleTransition)
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

  get transitioning() {
    return this._transitioning
  }

  set transitioning(value) {
    clearTimeout(this.transitionTimeout)
    this._transitioning = value

    if (this._transitioning) {
      this.element.setAttribute("data-transition-state", "transitioning")
      this.transitionTimeout = setTimeout(this.handleTransition, 1000)
    }
    else {
      this.element.removeAttribute("data-transition-state")
    }

    return this._transitioning
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

    if (this.transitioning || !receiver) return

    const delgated = new PolyFilledCustomEvent(`dispatched-${nativeEvent.type}`, {
      detail: {nativeEvent}
    })

    receiver.dispatchEvent(delgated)
  }

  @autobind
  handleKeyNavigation(event) {
    if (this.transitioning) return

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

  @autobind
  handleTransition(event) {
    const {content} = this.refs

    if (event) clearTimeout(this.transitionTimeout)

    if (event && event.target !== content) return
    if (this.handlingTransition) return

    this.handlingTransition = true

    const previousChild = this.route === "home" ? content.lastChild : content.firstChild

    requestAnimationFrame(() => {
      content.style.transform = "translate3d(0, 0, 0)"
      this.transitioning = false
      this.removeElement(previousChild)

      if (this.onTransitionEnd) {
        this.onTransitionEnd()
        this.onTransitionEnd = null
      }

      this.handlingTransition = false
    })
  }

  renderTargetSearch() {
    const {content} = this.refs
    const {firstChild} = content
    const targetSearch = new TargetSearch({
      targets: this.targets,
      onSelection: this.setNavigationState,
      onSubmit: selectedId => {
        this.route = selectedId
        this.navigateToTarget()
      }
    }).render()

    this.renderTitle(this.label("title"))

    if (!firstChild) {
      this.transitioning = false
      content.appendChild(targetSearch)
      return
    }

    this.transitioning = false
    content.insertBefore(targetSearch, firstChild)
      // -99% forces Safari to reveal the next element and paint it.
    content.style.transform = "translate3d(-99%, 0, 0)"

    requestAnimationFrame(() => {
      this.transitioning = true
      content.style.transform = "translate3d(0, 0, 0)"
    })
  }

  @autobind
  navigateToHome() {
    if (this.handlingTransition || this.transitioning) return

    this.route = "home"
    this.renderTargetSearch()
    this.autofocus()
  }

  @autobind
  navigateToTarget() {
    if (this.handlingTransition || this.transitioning) return

    const {autoDownload} = this.store
    const {content} = this.refs
    const {firstChild} = content
    const [target] = this.targets.filter(target => target.id === this.route)
    const targetWrapper = new TargetWrapper({
      onDone: this.closeModal,
      target
    }).render()

    function startDownload() {
      if (!autoDownload || !target.pluginURL) return

      setTimeout(target.startDownload, AUTO_DOWNLOAD_DELAY)
    }

    this.renderTitle(target.modalTitle)

    content.appendChild(targetWrapper)

    if (firstChild) {
      this.onTransitionEnd = startDownload
      this.transitioning = true

      requestAnimationFrame(() => {
        content.style.transform = "translate3d(-100%, 0, 0)"
      })
    }
    else {
      startDownload()
    }
  }
}
