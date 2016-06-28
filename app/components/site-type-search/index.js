import "./site-type-search.styl"

import BaseComponent from "components/base-component"
import template from "./site-type-search.pug"
import * as icons from "components/icons"

function setVisibility(element, hidden) {
  element.style.display = hidden ? "none" : ""
}

export default class SiteTypeSearch extends BaseComponent {
  template = template;

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

  // TODO: Flesh out keyboard navigation
  handleSearchInput({target: {value}}) {
    this.query = value
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const type = typesContainer.querySelector(`.type[data-id=${$.id}]`)

      setVisibility(type, $.hidden)
    })
  }

  handleSelection(selectedId) {
    this.store.selectedId = selectedId

    this.refs.types.forEach(this.setTypeStyle.bind(this))

    this.onSelection()
  }

  render() {
    this.compileTemplate()

    this.refs.search.addEventListener("input", this.handleSearchInput.bind(this))

    this.renderTypes()

    return this.element
  }

  renderTypes() {
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const icon = new icons[$.id]({fill: this.store.accent})
      const typeEl = typesContainer.appendChild(document.createElement("div"))

      typeEl.className = "type"
      typeEl.setAttribute("data-action", "")
      typeEl.setAttribute("data-ref", "types[]")
      typeEl.setAttribute("data-id", $.id)
      setVisibility(typeEl, $.hidden)

      typeEl.appendChild(icon.render())
      typeEl.appendChild(document.createTextNode($.label))
      this.updateRefs()

      this.setTypeStyle(typeEl)

      typeEl.addEventListener("click", this.handleSelection.bind(this, $.id))
    })
  }

  setTypeStyle(element) {
    const icon = element.querySelector(".icon")

    if (element.getAttribute("data-id") === this.store.selectedId) {
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

