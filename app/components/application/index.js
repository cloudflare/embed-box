import "./application.styl"

import BaseComponent from "components/base-component"
import template from "./application.pug"
import SiteTypeSearch from "components/site-type-search"
import * as icons from "components/icons"
import * as pages from "components/pages"

export default class Application extends BaseComponent {
  template = template;

  get previousAvailable() {
    return true // TODO: flesh out
  }

  handleSelection() {
    this.setNextInteraction()
  }

  handleBackwardProgression() {
    // TODO: flesh out
  }

  navigateToPage() {
    const {content} = this.refs
    const page = new pages[this.store.selectedId]()

    content.innerHTML = ""
    content.appendChild(page.render())
  }

  mount(mountPoint) {
    this.compileTemplate()

    const {content, headerButtons, nextPageButton} = this.refs

    const siteTypeSearch = new SiteTypeSearch({
      onSelection: this.handleSelection.bind(this)
    })

    headerButtons
      .forEach(button => {
        const id = button.getAttribute("data-action")
        const icon = new icons[id]({stroke: this.store.accent})

        button.appendChild(icon.render())
      })

    content.appendChild(siteTypeSearch.render())

    this.setNextInteraction()
    nextPageButton.addEventListener("click", this.navigateToPage.bind(this))

    mountPoint.appendChild(this.element)
  }

  setNextInteraction() {
    const {nextPageButton} = this.refs

    nextPageButton.disabled = !this.store.selectedId
  }
}

