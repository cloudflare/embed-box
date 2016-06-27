import store from "../store"

export default class BaseComponent {
  store = store;

  constructor(spec = {}) {
    Object.assign(this, spec)

    this.serializer = document.createElement("div")
  }

  compileTemplate(options = {}) {
    if (typeof this.template === "function") {
      this.serializer.innerHTML = this.template({store, ...options})
    }
    else {
      this.serializer.innerHTML = this.template
    }

    return this.serializer.firstChild
  }
}
