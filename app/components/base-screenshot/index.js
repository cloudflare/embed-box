import iframeTemplate from "./base-screenshot.pug"
import iframeStylesheet from "./screenshot-iframe.styl"

import arrowTopLeft from "./arrow-top-left.svg"
import arrowTopRight from "./arrow-top-right.svg"
import arrowBottomLeft from "./arrow-bottom-left.svg"
import arrowBottomRight from "./arrow-bottom-right.svg"

import BaseComponent from "components/base-component"

export default class BaseScreenshot {
  static iframeTemplate = iframeTemplate;
  static iframeStylesheet = iframeStylesheet;

  serialize = BaseComponent.prototype.serialize;

  render(config) {
    const {iframeTemplate, iframeStylesheet, stylesheet, template} = this.constructor

    const iframe = this.iframe = this.serialize(iframeTemplate)

    this.iframe.onload = () => {
      const iframeDocument = iframe.contentDocument
      const iframeStyle = iframeDocument.createElement("style")
      const style = iframeDocument.createElement("style")

      iframeStyle.innerHTML = iframeStylesheet
      iframeDocument.head.appendChild(iframeStyle)

      style.innerHTML = stylesheet
      iframeDocument.head.appendChild(style)

      const element = this.serialize(template, {
        config,
        arrowTopLeft,
        arrowTopRight,
        arrowBottomLeft,
        arrowBottomRight
      })

      iframeDocument.body.appendChild(element)

      requestAnimationFrame(() => {
        iframe.style.height = iframe.contentDocument.body.scrollHeight + "px"
      })
    }

    return this.iframe
  }
}
