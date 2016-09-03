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

    this.transitioning = false

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
  }

  get route() {
    return this._route
  }

  set route(value) {
    this._route = value

    if (this.routing) {
      setRoute(value === "home" ? "" : value)
    }

    return this._route
  }

  @autobind
  closeModal() {
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

    if (titleCharCount >= 40) {
      title.setAttribute("data-title-char-length", "long")
    }

    if (titleCharCount < 40) {
      title.setAttribute("data-title-char-length", "medium")
    }

    if (titleCharCount < 30) {
      title.setAttribute("data-title-char-length", "short")
    }

    if (titleCharCount < 20) {
      title.setAttribute("data-title-char-length", "puny")
    }
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

    content.insertBefore(targetSearch, firstChild)
    // -99% forces Safari to reveal the next element and paint it.
    content.style.transform = "translate3d(-99%, 0, 0)"

    this.handleTransition = event => {
      if (event.target !== content) return

      this.removeElement(firstChild)
      this.transitioning = false

      content.removeEventListener("transitionend", this.handleTransition)
      content.removeAttribute("data-transition-state")
    }

    requestAnimationFrame(() => {
      content.setAttribute("data-transition-state", "transitioning")

      requestAnimationFrame(() => {
        content.addEventListener("transitionend", this.handleTransition)
        content.style.transform = "translate3d(0, 0, 0)"
      })
    })
  }

  @autobind
  navigateToHome() {
    this.transitioning = true
    this.route = "home"
    this.renderTargetSearch()
    this.autofocus()

    this.element.setAttribute("data-route", this.route)
  }

  @autobind
  navigateToTarget() {
    this.transitioning = true

    const {autoDownload} = this.store
    const {content} = this.refs
    const {firstChild} = content
    const [target] = this.targets.filter(target => target.id === this.route)
    const targetWrapper = new TargetWrapper({
      onDone: this.closeModal,
      target
    }).render()

    function onRender() {
      if (!autoDownload || !target.pluginURL) return

      setTimeout(target.startDownload, AUTO_DOWNLOAD_DELAY)
    }

    this.renderTitle(target.modalTitle)

    content.appendChild(targetWrapper)

    if (firstChild) {
      this.handleTransition = event => {
        if (event.target !== content) return

        this.removeElement(firstChild)
        this.autofocus()
        this.element.setAttribute("data-route", this.route)
        this.transitioning = false

        content.removeEventListener("transitionend", this.handleTransition)
        content.removeAttribute("data-transition-state")
        content.style.transform = "translate3d(0, 0, 0)"

        targetWrapper.firstChild.focus()
        onRender()
      }

      content.addEventListener("transitionend", this.handleTransition)

      content.setAttribute("data-transition-state", "transitioning")

      requestAnimationFrame(() => {
        content.style.transform = "translate3d(-100%, 0, 0)"
      })
    }
    else {
      onRender()
    }
  }
}
