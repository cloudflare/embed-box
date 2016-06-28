import "./application.styl"

import BaseComponent from "components/base-component"
import template from "./application.pug"
import SiteTypeSearch from "components/site-type-search"
import * as icons from "components/icons"

export default class Application extends BaseComponent {
  template = template;

  get previousAvailable() {
    return true // TODO: flesh out
  }

  handleSelection() {
    this.setNextInteraction()
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

    this.setNextInteraction()

    mountPoint.appendChild(element)
  }

  setNextInteraction() {
    const button = this.element.querySelector("button[data-action='next']")

    button.disabled = !this.store.selectedId
  }
}

