import "./site-type-search.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import template from "./site-type-search.pug"
import * as icons from "components/icons"
import KM from "lib/key-map"

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

  handleSearchInput({target: {value}}) {
    this.query = value
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const type = typesContainer.querySelector(`.type[data-id=${$.id}]`)

      setVisibility(type, $.hidden)
    })
  }

  handleSearchKeyDown(event) {
    const delta = {
      [KM.up]: -1,
      [KM.down]: 1
    }[event.keyCode]

    if (!delta) return

    event.preventDefault()

    let {selectedId} = this.store
    const types = this.types.filter(type => !type.hidden)

    if (!types.length) return

    const {length} = types
    const currentIndex = types.findIndex(({id}) => id === selectedId) || 0

    // Move the index by delta and wrap around the bottom/top
    const nextIndex = (currentIndex + delta + length) % length

    selectedId = types[nextIndex].id
    this.handleSelection(selectedId)
  }

  handleSearchKeypress(event) {
    if (event.keyCode !== KM.enter || !this.store.selectedId) return

    event.preventDefault()

    this.onSubmit()
  }

  handleSelection(selectedId) {
    this.store.selectedId = selectedId

    this.refs.types.forEach(this.setTypeStyle)

    this.onSelection()
  }

  render() {
    this.compileTemplate()

    const {search} = this.refs

    search.addEventListener("input", this.handleSearchInput.bind(this))
    search.addEventListener("keydown", this.handleSearchKeyDown.bind(this))
    search.addEventListener("keypress", this.handleSearchKeypress.bind(this))

    this.renderTypes()

    return this.element
  }

  renderTypes() {
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const icon = new icons[$.id]()
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

  @autobind
  setTypeStyle(element) {
    if (element.getAttribute("data-id") === this.store.selectedId) {
      element.setAttribute("data-selected", "")
    }
    else {
      element.removeAttribute("data-selected")
    }
  }
}

