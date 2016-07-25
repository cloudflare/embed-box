import stylesheet from "./application.styl"
import template from "./application.pug"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import {getStore} from "lib/store"
import * as icons from "components/icons"
import KM from "lib/key-map"
import SiteTypeSearch from "components/site-type-search"
import PageWrapper from "components/page-wrapper"

export default class Application extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  page = "home";

  constructor(mountPoint, options) {
    super(options)

    const element = this.compileTemplate()

    const {window: iframeWindow} = getStore().iframe
    const {closeModalButton, previousPageButton} = this.refs
    const headerButtons = [closeModalButton, previousPageButton]

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

    previousPageButton.addEventListener("click", this.navigateToHome)

    this.navigateToHome()
    mountPoint.appendChild(this.element)
  }

  @autobind
  closeModal() {
    this.onClose()
  }

  @autobind
  delgateKeyEvent(nativeEvent) {
    const receiver = this.refs.content.querySelector("[data-event-receiver]")

    if (!receiver) return

    const delgated = new CustomEvent(`dispatched-${nativeEvent.type}`, {
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

        if (this.page !== "home") this.navigateToHome()
        break

      default:
        this.delgateKeyEvent(event)
    }
  }

  renderSiteTypeSearch() {
    const {content} = this.refs
    const {firstChild} = content
    const siteTypeSearch = new SiteTypeSearch({
      pages: this.pages,
      onSelection: this.setNavigationState,
      onSubmit: selectedId => {
        this.page = selectedId
        this.navigateToPage()
      }
    }).render()

    if (!firstChild) {
      content.appendChild(siteTypeSearch)
      return
    }

    content.insertBefore(siteTypeSearch, firstChild)

    siteTypeSearch.setAttribute("data-transition", "hidden-left")
    siteTypeSearch.addEventListener("transitionend", () => this.removeElement(firstChild))

    requestAnimationFrame(() => siteTypeSearch.setAttribute("data-transition", "visible"))
  }

  @autobind
  navigateToHome() {
    this.page = "home"
    this.renderSiteTypeSearch()
    this.autofocus()

    this.element.setAttribute("data-page", this.page)
  }

  @autobind
  navigateToPage() {
    const {content} = this.refs
    const {firstChild} = content
    const [Page] = this.pages.filter(page => page.id === this.page)
    const pageWrapper = new PageWrapper({
      onDone: this.closeModal,
      page: new Page()
    }).render()

    content.appendChild(pageWrapper)

    firstChild.addEventListener("transitionend", () => {
      this.removeElement(firstChild)
      this.autofocus()
      this.element.setAttribute("data-page", this.page)

      pageWrapper.firstChild.focus()
    })

    requestAnimationFrame(() => firstChild.setAttribute("data-transition", "hidden-left"))
  }
}

