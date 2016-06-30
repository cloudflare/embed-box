import "./site-type-search.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import template from "./site-type-search.pug"
import * as icons from "components/icons"
import KM from "lib/key-map"

const {search: SearchIcon} = icons

function setVisibility(element, hidden) {
  element.style.display = hidden ? "none" : ""
}

export default class SiteTypeSearch extends BaseComponent {
  template = template;

  get types() {
    const {query, store: {types}} = this

    if (!query) return types

    return types.map(type => {
      const label = type.label.toLowerCase()

      return {
        ...type,
        hidden: label.indexOf(query) === -1 && !type.fallback
      }
    })
  }

  @autobind
  handleSearchInput({target: {value}}) {
    this.query = value.toLowerCase()
    const {typesContainer} = this.refs

    this.types.forEach(({id, hidden}) => {
      const type = typesContainer.querySelector(`.type[data-id=${id}]`)

      setVisibility(type, hidden)
    })

    const [firstVisible] = this.types.filter(({hidden}) => !hidden)

    this.selectType(firstVisible.id, {focus: true})
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
    const searchIcon = new SearchIcon()

    this.insertBefore(searchIcon.render(), search)

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

