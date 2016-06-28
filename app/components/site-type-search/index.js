import "./site-type-search.styl"

import BaseComponent from "components/base-component"
import template from "./site-type-search.pug"
import * as icons from "components/icons"

function setVisibility(element, hidden) {
  element.style.display = hidden ? "none" : ""
}

export default class SiteTypeSearch extends BaseComponent {
  template = template;
  selectedId = "";

  get types() {
    let {types} = this.store

    if (this.query) {
      const pattern = new RegExp(this.query, "i")

      types = types.map(type => {
        return {
          ...type,
          hidden: type.label.search(pattern) === -1
        }
      })
    }

    return types
  }

  handleSearchInput({target: {value}}) {
    this.query = value

    this.types.forEach($ => {
      const type = this.element.querySelector(`.type[data-id=${$.id}]`)

      setVisibility(type, $.hidden)
    })
  }

  handleSelection(selectedId) {
    this.selectedId = selectedId

    Array
      .from(this.element.querySelectorAll(".types .type"))
      .forEach(this.setTypeStyle.bind(this))
  }

  mount(mountEl) {
    this.element = this.compileTemplate()

    this.element
      .querySelector("input.search")
      .addEventListener("input", this.handleSearchInput.bind(this))

    this.renderTypes()

    mountEl.parentNode.insertBefore(this.element, mountEl)
    mountEl.parentNode.removeChild(mountEl)
  }

  renderTypes() {
    const typesContainer = this.element.querySelector(".types")

    this.types.forEach($ => {
      const icon = new icons[$.id]({fill: this.store.accent})
      const typeEl = typesContainer.appendChild(document.createElement("div"))

      typeEl.className = "type"
      typeEl.setAttribute("data-action", "")
      typeEl.setAttribute("data-id", $.id)
      setVisibility(typeEl, $.hidden)

      typeEl.appendChild(icon.render())
      typeEl.appendChild(document.createTextNode($.label))
      this.setTypeStyle(typeEl)

      typeEl.addEventListener("click", this.handleSelection.bind(this, $.id))
    })
  }

  setTypeStyle(element) {
    const icon = element.querySelector(".icon")

    if (element.getAttribute("data-id") === this.selectedId) {
      element.setAttribute("data-selected", "")
      Object.assign(element.style, {
        backgroundColor: this.store.accent,
        color: this.store.backgroundColor
      })

      element.style.backgroundColor = this.store.accent
      icon.setAttribute("fill", this.store.backgroundColor)
    }
    else {
      element.removeAttribute("data-selected")
      Object.assign(element.style, {
        backgroundColor: this.store.backgroundColor,
        color: this.store.textColor
      })
      icon.setAttribute("fill", this.store.accent)
    }
  }
}

