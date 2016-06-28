import "./application.styl"

import BaseComponent from "components/base-component"
import template from "./application.pug"
import SiteTypeSearch from "components/site-type-search"
import * as icons from "components/icons"
import * as pages from "components/pages"

export default class Application extends BaseComponent {
  template = template;

  closeModal() {
    // TODO: flesh out.
    console.log("Modal close")
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
      const icon = new icons[id]({stroke: this.store.accent})

      button.appendChild(icon.render())
    })

    this.renderSiteTypeSearch()

    closeModalButton.addEventListener("click", this.closeModal.bind(this))
    doneButton.addEventListener("click", this.closeModal.bind(this))

    previousPageButton.addEventListener("click", this.navigateToHome.bind(this))

    this.setNavigationState()
    nextPageButton.addEventListener("click", this.navigateToPage.bind(this))

    mountPoint.appendChild(this.element)
  }

  renderSiteTypeSearch() {
    const {content} = this.refs
    const siteTypeSearch = new SiteTypeSearch({
      onSelection: this.setNavigationState.bind(this)
    })

    content.innerHTML = ""

    content.appendChild(siteTypeSearch.render())
  }

  navigateToHome() {
    this.store.page = "home"
    this.setNavigationState()
    this.renderSiteTypeSearch()
  }

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

