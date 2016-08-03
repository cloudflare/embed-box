import stylesheet from "./application.styl"
import template from "./application.pug"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import {getStore} from "lib/store"
import * as icons from "components/icons"
import KM from "lib/key-map"
import SiteTypeSearch from "components/site-type-search"
import TargetWrapper from "components/target-wrapper"

export default class Application extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  constructor(mountPoint, options) {
    super(options)

    this.transitioning = false

    const element = this.compileTemplate()

    const {window: iframeWindow} = getStore().iframe
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

    if (options.initialTarget) {
      this.route = options.initialTarget
      this.navigateToTarget()
    }
    else {
      this.route = "home"
      this.navigateToHome()
    }

    mountPoint.appendChild(this.element)
  }

  @autobind
  closeModal() {
    this.onClose()
  }

  @autobind
  delgateKeyEvent(nativeEvent) {
    const receiver = this.refs.content.querySelector("[data-event-receiver]")

    if (this.transitioning || !receiver) return

    const delgated = new CustomEvent(`dispatched-${nativeEvent.type}`, {
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

  renderSiteTypeSearch() {
    const {content} = this.refs
    const {firstChild} = content
    const siteTypeSearch = new SiteTypeSearch({
      targets: this.targets,
      onSelection: this.setNavigationState,
      onSubmit: selectedId => {
        this.route = selectedId
        this.navigateToTarget()
      }
    }).render()

    if (!firstChild) {
      content.appendChild(siteTypeSearch)
      return
    }

    content.insertBefore(siteTypeSearch, firstChild)

    siteTypeSearch.setAttribute("data-transition", "hidden-left")
    siteTypeSearch.addEventListener("transitionend", () => {
      this.removeElement(firstChild)
      this.transitioning = false
    })

    requestAnimationFrame(() => siteTypeSearch.setAttribute("data-transition", "visible"))
  }

  @autobind
  navigateToHome() {
    this.transitioning = false
    this.route = "home"
    this.renderSiteTypeSearch()
    this.autofocus()

    this.element.setAttribute("data-route", this.route)
  }

  @autobind
  navigateToTarget() {
    this.transitioning = true

    const {content} = this.refs
    const {firstChild} = content
    const [target] = this.targets.filter(target => target.id === this.route)
    const targetWrapper = new TargetWrapper({
      onDone: this.closeModal,
      target
    }).render()

    content.appendChild(targetWrapper)

    if (firstChild) {
      firstChild.addEventListener("transitionend", () => {
        this.removeElement(firstChild)
        this.autofocus()
        this.element.setAttribute("data-route", this.route)
        this.transitioning = false

        targetWrapper.firstChild.focus()
      })

      requestAnimationFrame(() => firstChild.setAttribute("data-transition", "hidden-left"))
    }
  }
}

