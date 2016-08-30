import iframeTemplate from "./base-screenshot.pug"
import iframeStylesheet from "./screenshot-iframe.styl"

import BaseComponent from "components/base-component"

export default class BaseScreenshot {
  static iframeTemplate = iframeTemplate;
  static iframeStylesheet = iframeStylesheet;

  serialize = BaseComponent.prototype.serialize;

  refreshHeight() {
    this.iframe.style.height = this.iframe.contentDocument.body.scrollHeight + "px"
  }

  render(target) {
    const {iframeTemplate, iframeStylesheet, stylesheet, template} = this.constructor

    const root = this.root = this.serialize(iframeTemplate)
    const iframe = this.iframe = root.querySelector('iframe')

    this.iframe.onload = () => {
      const iframeDocument = iframe.contentDocument
      const iframeStyle = iframeDocument.createElement("style")
      const style = iframeDocument.createElement("style")

      iframeStyle.innerHTML = iframeStylesheet
      iframeDocument.head.appendChild(iframeStyle)

      style.innerHTML = stylesheet
      iframeDocument.head.appendChild(style)

      const element = this.serialize.call(target, template)

      iframeDocument.body.appendChild(element)

      requestAnimationFrame(() => {
        this.refreshHeight()
        if (this.componentRendered) this.componentRendered(target)
      })
    }

    return this.root
  }
}
