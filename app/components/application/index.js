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
    const currentContent = this.element.querySelector(".content")
    const page = new pages[this.store.selectedId]()

    this.replaceElement(currentContent, page.render())
  }

  mount(mountPoint) {
    const element = this.element = this.compileTemplate()
    const siteTypeSearch = new SiteTypeSearch({
      onSelection: this.handleSelection.bind(this)
    })

    Array
      .from(element.querySelectorAll(".modal-header button[data-action]"))
      .forEach(child => {
        const id = child.getAttribute("data-action")
        const icon = new icons[id]({stroke: this.store.accent})

        child.appendChild(icon.render())
      })

    siteTypeSearch.mount(element.querySelector(".content"))

    const button = element.querySelector("button[data-action='next']")

    this.setNextInteraction()
    button.addEventListener("click", this.navigateToPage.bind(this))

    mountPoint.appendChild(element)
  }

  setNextInteraction() {
    const button = this.element.querySelector("button[data-action='next']")

    button.disabled = !this.store.selectedId
  }
}

