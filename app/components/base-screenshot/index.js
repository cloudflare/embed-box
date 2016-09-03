import iframeTemplate from "./base-screenshot.pug"
import iframeStylesheet from "./screenshot-iframe.styl"

import BaseComponent from "components/base-component"
import autobind from "autobind-decorator"

export default class BaseScreenshot {
  static iframeTemplate = iframeTemplate;
  static iframeStylesheet = iframeStylesheet;

  serialize = BaseComponent.prototype.serialize;

  @autobind
  refreshScale() {
    if (this.element.getAttribute("data-render-state") === "scaled") {
      this.element.setAttribute("data-render-state", "unscaled")

      this.iframe.style.height = ""
      this.element.style.height = ""

      requestAnimationFrame(this.refreshScale)
      return
    }

    const iframeDocument = this.iframe.contentDocument
    const {clientWidth} = this.element.querySelector(".intrinsic-spacer")
    const iframeWidth = parseInt(this.iframe.width, 10)
    const scale = clientWidth > iframeWidth ? 1 : clientWidth / iframeWidth

    // Scale the inner content.
    this.iframe.style.transform = `scale(${scale})`

    const iframeInnerHeight = this.iframe.contentDocument.body.scrollHeight

    // Give the inner content a fixed height to prevent scrolling.
    this.iframe.style.height = iframeInnerHeight + "px"
    //
    // Give the container a scaled height to compensate for the transform.
    this.element.style.height = iframeInnerHeight * scale + "px"

    this.element.setAttribute("data-render-state", "scaled")

    const {backgroundColor} = iframeDocument.defaultView.getComputedStyle(iframeDocument.body)

    // Blend background with scaled iframe contents for a seamless appearance.
    this.element.style.backgroundColor = backgroundColor
    iframeDocument.body.style.background = "transparent" // Fixes Chrome render bug.
  }

  render(target) {
    const {iframeTemplate, iframeStylesheet, stylesheet, template} = this.constructor

    const element = this.element = this.serialize(iframeTemplate)
    const iframe = this.iframe = element.querySelector("iframe")


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
        if (this.componentDidMount) this.componentDidMount(target)
        this.refreshScale()
      })
    }

    return this.element
  }
}
