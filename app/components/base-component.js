import autobind from "autobind-decorator"

// Ends with brackets e.g. [data-ref="foo[]"]
const ARRAY_REF_PATTERN = /([a-zA-Z\d]*)(\[?\]?)/

export default class BaseComponent {
  static template = null;
  static stylesheet = null;
  static store = null;

  constructor(spec = {}) {
    Object.assign(this, {
      store: null,
      element: null,
      refs: {}
    }, spec)

    this.appendStylesheet()
  }

  appendStylesheet() {
    const {stylesheet} = this.constructor

    if (!stylesheet) return
    if (!this.store) {
      console.error(this)
      throw new Error("Component attempted to mount stylesheet without a store reference")
    }

    const {element: iframeElement, document: iframeDocument} = this.store.iframe

    const onLoad = () => {
      if (iframeDocument.head.contains(this.constructor.styleElement)) return

      // Common style tag has yet to be inserted in iframe.
      const styleElement = iframeDocument.createElement("style")

      styleElement.innerHTML = stylesheet
      this.constructor.styleElement = iframeDocument.head.appendChild(styleElement)
    }

    if (iframeDocument.head) onLoad()
    else iframeElement.addEventListener("load", onLoad)
  }

  @autobind
  asset(path) {
    return `${this.store.assetPath}${path}`
  }

  autofocus() {
    if (this.store.mode === "inline") return

    const focusElement = this.element.querySelector("[autofocus]")

    if (focusElement) focusElement.focus()
  }

  // NOTE: Calling `updateRefs` multiple times from different tree depths may
  // allow parents to inherit a grandchild.
  updateRefs() {
    const {refs} = this

    Array
      .from(this.element.querySelectorAll("[data-ref]"))
      .forEach(element => {
        const attribute = element.getAttribute("data-ref")
        const [, key, arrayKey] = attribute.match(ARRAY_REF_PATTERN)

        if (arrayKey) {
          // Multiple elements
          if (!Array.isArray(refs[key])) refs[key] = []

          refs[key].push(element)
        }
        else {
          // Single element
          refs[key] = element
        }

        element.removeAttribute("data-ref")
      })
  }

  serialize(template, templateVars = {}) {
    // `document` is used instead of iframe's document to prevent `instanceof` reference errors.
    const serializer = document.createElement("div")

    if (typeof template === "function") {
      serializer.innerHTML = template.call(this, {
        asset: this.asset,
        config: this.store,
        label: this.label,
        ...templateVars
      })
    }
    else {
      serializer.innerHTML = template
    }

    return serializer.firstChild
  }

  compileTemplate(templateVars = {}) {
    const {template} = this.constructor

    this.element = this.serialize(template, templateVars)
    this.updateRefs()

    return this.element
  }

  @autobind
  label(key) {
    const {store} = this
    const value = store.labels[key]

    return typeof value === "function" ? value(store) : value
  }

  insertBefore(sibling, element) {
    element.parentNode.insertBefore(sibling, element)
  }

  removeElement(element) {
    if (!element || !element.parentNode) return null

    return element.parentNode.removeChild(element)
  }

  render() {
    return this.compileTemplate()
  }

  replaceElement(current, next) {
    current.parentNode.insertBefore(next, current)
    current.parentNode.removeChild(current)

    next.tabIndex = current.tabIndex

    this.updateRefs()
  }
}
