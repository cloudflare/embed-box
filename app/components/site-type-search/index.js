import stylesheet from "./site-type-search.styl"

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
  static template = template;
  static stylesheet = stylesheet;

  selectedId = null;

  get types() {
    const {query, pages} = this

    if (!query) return pages

    return pages.map(page => {
      const label = page.label.toLowerCase()

      return {
        ...page,
        hidden: label.indexOf(query) === -1 && !page.fallback
      }
    })
  }

  @autobind
  handleSearchInput() {
    const {search, typesContainer} = this.refs

    this.query = search.value.toLowerCase()

    this.types.forEach(({id, hidden}) => {
      const type = typesContainer.querySelector(`.type[data-id=${id}]`)

      setVisibility(type, hidden)
    })

    const [firstVisible] = this.types.filter(({hidden}) => !hidden)

    this.selectType(firstVisible.id, {focus: true})
  }

  @autobind
  handleDelgatedKeydown({detail: {keyCode, nativeEvent}}) {
    const delta = {
      [KM.up]: -1,
      [KM.down]: 1
    }[keyCode || nativeEvent.keyCode]

    if (!delta) return

    if (nativeEvent) nativeEvent.preventDefault()

    let {selectedId} = this
    const types = this.types.filter(type => !type.hidden)

    if (!types.length) return

    const {length} = types
    const currentIndex = types.findIndex(({id}) => id === selectedId) || 0

    // Move the index by delta and wrap around the bottom/top.
    const nextIndex = (currentIndex + delta + length) % length

    selectedId = types[nextIndex].id

    this.selectType(selectedId, {focus: true})
  }

  @autobind
  handleDelgatedKeypress({detail: {nativeEvent}}) {
    if (nativeEvent.keyCode !== KM.enter) return

    nativeEvent.preventDefault()
    this.submit()
  }

  @autobind
  submit() {
    if (!this.selectedId) return

    this.onSubmit(this.selectedId)
  }

  selectType(selectedId, options = {}) {
    const {types, typesContainer} = this.refs

    this.selectedId = selectedId

    types.forEach(this.setTypeStyle)

    if (options.focus) {
      typesContainer
        .querySelector(`.type[data-id="${selectedId}"]`)
        .scrollIntoView(true)
    }

    this.setNavigationState()
  }

  setNavigationState() {
    const {nextPageButton} = this.refs

    nextPageButton.disabled = !this.selectedId
  }

  render() {
    this.compileTemplate()

    const {nextPageButton, search} = this.refs
    const searchIcon = new SearchIcon()

    this.insertBefore(searchIcon.render(), search)

    search.addEventListener("input", this.handleSearchInput)

    this.renderTypes()
    this.setNavigationState()

    this.element.addEventListener("dispatched-keydown", this.handleDelgatedKeydown)
    this.element.addEventListener("dispatched-keypress", this.handleDelgatedKeypress)
    this.element.addEventListener("dispatched-input", this.handleSearchInput)
    nextPageButton.addEventListener("click", this.submit)

    return this.element
  }

  renderTypes() {
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const Icon = icons[$.id] || icons.generic
      const icon = new Icon()
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

      typeEl.addEventListener("click", () => this.selectType($.id, {focus: true}))
    })
  }

  @autobind
  setTypeStyle(element) {
    if (element.getAttribute("data-id") === this.selectedId) {
      element.setAttribute("data-selected", "")
    }
    else {
      element.removeAttribute("data-selected")
    }
  }
}

