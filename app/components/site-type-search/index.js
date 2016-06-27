import "./site-type-search.styl"

import BaseComponent from "components/base-component"
import template from "./site-type-search.pug"
import * as icons from "components/icons"

function setVisibility(element, hidden) {
  element.style.display = hidden ? "none" : ""
}

function setSelected(selectedId, element) {
  if (element.getAttribute("data-id") === selectedId) element.setAttribute("data-selected", "")
  else element.removeAttribute("data-selected")
}

export default class SiteTypeSearch extends BaseComponent {
  template = template;

  constructor() {
    super()

    this.selected = ""
  }

  get types() {
    let {types} = this.store

    if (this.query) {
      const pattern = new RegExp(this.query, "i")

      types = types.map($ => ({...$, hidden: $.label.search(pattern) === -1}))
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
    this.selected = selectedId

    Array
      .from(this.element.querySelectorAll(".types .type"))
      .forEach(setSelected.bind(null, selectedId))
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

      typeEl.addEventListener("click", this.handleSelection.bind(this, $.id))
    })
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
}

