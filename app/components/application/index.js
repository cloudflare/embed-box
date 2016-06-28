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

  mount(mountPoint) {
    const siteTypeSearch = new SiteTypeSearch()
    const element = this.compileTemplate()

    Array
      .from(element.querySelectorAll(".modal-header button[data-action]"))
      .forEach(child => {
        const id = child.getAttribute("data-action")
        const icon = new icons[id]({stroke: this.store.accent})

        child.appendChild(icon.render())
      })

    siteTypeSearch.mount(element.querySelector(".content"))

    mountPoint.appendChild(element)
  }
}

