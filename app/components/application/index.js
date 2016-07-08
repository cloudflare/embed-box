import stylesheet from "./application.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import * as icons from "components/icons"
import SiteTypeSearch from "components/site-type-search"
import template from "./application.pug"
import KM from "lib/key-map"

export default class Application extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  @autobind
  closeModal() {
    this.onClose()
  }

  isHome() {
    return this.store.page === "home"
  }

  @autobind
  delgateKeyEvent(nativeEvent) {
    const receiver = this.refs.content.querySelector("[data-event-receiver]")

    if (!receiver || !this.supportsCustomEvents) return

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

        if (!this.isHome()) this.navigateToHome()
        break

      default:
        this.delgateKeyEvent(event)
    }
  }

  mount(mountPoint) {
    const element = this.compileTemplate()

    const {window: iframeWindow} = this.store.iframe
    const {doneButton, closeModalButton, nextPageButton, previousPageButton} = this.refs
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
    doneButton.addEventListener("click", this.closeModal)
    element.addEventListener("click", event => {
      if (event.target === element) this.closeModal()
    })

    previousPageButton.addEventListener("click", this.navigateToHome)

    nextPageButton.addEventListener("click", this.navigateToPage)

    this.navigateToHome()

    mountPoint.appendChild(this.element)
  }

  renderSiteTypeSearch() {
    const {content} = this.refs
    const siteTypeSearch = new SiteTypeSearch({
      fooTypes: this.pages,
      onSelection: this.setNavigationState,
      onSubmit: this.navigateToPage
    })

    content.innerHTML = ""

    content.appendChild(siteTypeSearch.render())
  }

  @autobind
  navigateToHome() {
    this.store.page = "home"
    this.setNavigationState()
    this.renderSiteTypeSearch()
    this.autofocus()

    this.element.setAttribute("data-page", this.store.page)
  }

  @autobind
  navigateToPage() {
    const {store} = this

    store.page = store.selectedId
    store.selectedId = ""

    const {content} = this.refs
    const [Page] = this.pages.filter(page => page.id === store.page)
    const page = new Page()

    content.innerHTML = ""
    content.appendChild(page.render())

    this.setNavigationState()
    this.autofocus()

    this.element.setAttribute("data-page", store.page)
  }

  @autobind
  setNavigationState() {
    const {nextPageButton} = this.refs

    nextPageButton.disabled = !this.store.selectedId
  }
}

