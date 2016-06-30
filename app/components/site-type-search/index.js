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
      types = types.map(type => {
        return {
          ...type,
          hidden: type.label.toLowerCase().indexOf(this.query) === -1
        }
      })
    }

    return types
  }

  @autobind
  handleSearchInput({target: {value}}) {
    this.query = value.toLowerCase()
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const type = typesContainer.querySelector(`.type[data-id=${$.id}]`)

      setVisibility(type, $.hidden)
    })
  }

  @autobind
  handleDelgatedKeydown({detail: {nativeEvent}}) {
    const delta = {
      [KM.up]: -1,
      [KM.down]: 1
    }[nativeEvent.keyCode]

    if (!delta) return

    nativeEvent.preventDefault()

    let {selectedId} = this.store
    const types = this.types.filter(type => !type.hidden)

    if (!types.length) return

    const {length} = types
    const currentIndex = types.findIndex(({id}) => id === selectedId) || 0

    // Move the index by delta and wrap around the bottom/top
    const nextIndex = (currentIndex + delta + length) % length

    selectedId = types[nextIndex].id

    this.selectType(selectedId, {focus: true})
  }

  @autobind
  handleDelgatedKeypress({detail: {nativeEvent}}) {
    if (nativeEvent.keyCode !== KM.enter || !this.store.selectedId) return

    nativeEvent.preventDefault()

    this.onSubmit()
  }

  selectType(selectedId, options = {}) {
    const {types, typesContainer} = this.refs

    this.store.selectedId = selectedId

    types.forEach(this.setTypeStyle)

    if (options.focus) {
      typesContainer
        .querySelector(`.type[data-id="${selectedId}"]`)
        .scrollIntoView(true)
    }

    this.onSelection()
  }

  render() {
    this.compileTemplate()

    const {search} = this.refs

    search.addEventListener("input", this.handleSearchInput)

    this.renderTypes()

    this.element.addEventListener("dispatched-keydown", this.handleDelgatedKeydown)
    this.element.addEventListener("dispatched-keypress", this.handleDelgatedKeypress)

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

      typeEl.addEventListener("click", () => this.selectType($.id))
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

