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
    const {query, targets} = this

    return targets.map(({id, label, fallback}) => {
      const hidden = query && label.toLowerCase().indexOf(query) === -1 && !fallback

      return {id, label, hidden}
    })
  }

  @autobind
  handleSearchInput() {
    const {search, typesContainer} = this.refs

    this.query = search.value.toLowerCase()

    this.types.forEach(({id, hidden}) => {
      const type = typesContainer.querySelector(`.type[data-id=${id}]`)

      type.removeAttribute("data-first-visible")
      setVisibility(type, hidden)
    })

    const [firstVisible] = this.types.filter(({hidden}) => !hidden)
    const firstVisibleEl = typesContainer.querySelector(`.type[data-id=${firstVisible.id}]`)

    firstVisibleEl.setAttribute("data-first-visible", "")
    this.selectType(firstVisible.id)
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

    this.selectType(selectedId)
  }

  @autobind
  handleDelgatedKeypress({detail: {keyCode, nativeEvent}}) {
    keyCode = keyCode || nativeEvent.keyCode

    if (keyCode !== KM.enter) return
    if (nativeEvent) nativeEvent.preventDefault()

    this.submit()
  }

  @autobind
  submit() {
    if (!this.selectedId) return

    this.onSubmit(this.selectedId)
  }

  selectType(selectedId) {
    const {types, typesContainer, search} = this.refs
    const iframeDocument = this.store.iframe.document
    const selectedType = typesContainer.querySelector(`.type[data-id="${selectedId}"]`)

    this.selectedId = selectedId

    types.forEach(this.setTypeStyle)

    if (search !== iframeDocument.activeElement) {
      selectedType.focus()
    }

    this.setNavigationState()
  }

  setNavigationState() {
    const {nextButton} = this.refs

    nextButton.disabled = !this.selectedId
  }

  render() {
    this.compileTemplate()

    const {nextButton, search} = this.refs
    const searchIcon = new SearchIcon()

    this.insertBefore(searchIcon.render(), search)

    search.addEventListener("input", this.handleSearchInput)

    this.renderTypes()
    this.setNavigationState()

    this.element.addEventListener("dispatched-keydown", this.handleDelgatedKeydown)
    this.element.addEventListener("dispatched-keypress", this.handleDelgatedKeypress)
    this.element.addEventListener("dispatched-input", this.handleSearchInput)
    nextButton.addEventListener("click", this.submit)

    return this.element
  }

  renderTypes() {
    const {typesContainer} = this.refs

    this.types.forEach($ => {
      const Icon = icons[$.id] || icons.generic
      const icon = new Icon()
      const typeEl = typesContainer.appendChild(document.createElement("div"))

      typeEl.className = "type"
      typeEl.setAttribute("tabindex", "4")
      typeEl.setAttribute("data-action", "")
      typeEl.setAttribute("data-ref", "types[]")
      typeEl.setAttribute("data-id", $.id)
      setVisibility(typeEl, $.hidden)

      typeEl.appendChild(icon.render())
      typeEl.appendChild(document.createTextNode($.label))

      this.updateRefs()
      this.setTypeStyle(typeEl)

      typeEl.addEventListener("click", () => this.selectType($.id))

      typeEl.addEventListener("keydown", event => {
        if (event.keyCode === KM.enter || event.keyCode === KM.spacebar) {
          event.preventDefault()
          this.selectType($.id)
        }
      })
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
