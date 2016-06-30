import "./application.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import * as icons from "components/icons"
import * as pages from "components/pages"
import SiteTypeSearch from "components/site-type-search"
import template from "./application.pug"

export default class Application extends BaseComponent {
  template = template;

  @autobind
  closeModal() {
    // TODO: flesh out.
    console.log("Modal close", this)
  }

  isHome() {
    return this.store.page === "home"
  }

  mount(mountPoint) {
    this.compileTemplate()

    const {doneButton, closeModalButton, nextPageButton, previousPageButton} = this.refs
    const headerButtons = [closeModalButton, previousPageButton]

    headerButtons.forEach(button => {
      const id = button.getAttribute("data-action")
      const icon = new icons[id]()

      button.appendChild(icon.render())
    })

    this.renderSiteTypeSearch()

    closeModalButton.addEventListener("click", this.closeModal)
    doneButton.addEventListener("click", this.closeModal)

    previousPageButton.addEventListener("click", this.navigateToHome)

    this.setNavigationState()
    nextPageButton.addEventListener("click", this.navigateToPage)

    mountPoint.appendChild(this.element)
  }

  renderSiteTypeSearch() {
    const {content} = this.refs
    const siteTypeSearch = new SiteTypeSearch({
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
  }

  @autobind
  navigateToPage() {
    const {store} = this

    store.page = store.selectedId
    store.selectedId = ""

    const {content} = this.refs
    const page = new pages[store.page]()

    content.innerHTML = ""
    content.appendChild(page.render())

    this.setNavigationState()
  }

  @autobind
  setNavigationState() {
    const {doneButton, nextPageButton, previousPageButton} = this.refs
    const isHome = this.isHome()

    nextPageButton.disabled = !this.store.selectedId
    nextPageButton.style.display = isHome ? "" : "none"
    doneButton.style.display = isHome ? "none" : ""

    if (isHome) previousPageButton.setAttribute("data-hidden", "")
    else previousPageButton.removeAttribute("data-hidden")
  }
}

