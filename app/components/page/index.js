import stylesheet from "./pages.styl"

import BaseComponent from "components/base-component"

let mountedSharedStyle = false

export default class Page extends BaseComponent {
  constructor() {
    super()

    const {document: iframeDocument} = this.store.iframe

    if (!mountedSharedStyle) {
      const style = iframeDocument.createElement("style")

      style.innerHTML = stylesheet

      iframeDocument.head.appendChild(style)

      mountedSharedStyle = true
    }
  }
}
