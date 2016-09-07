import iframeTemplate from "./base-screenshot.pug"
import iframeStylesheet from "./screenshot-iframe.styl"

import BaseComponent from "components/base-component"
import autobind from "autobind-decorator"

const toPrecision = (number, precision = 5) => parseFloat(number.toPrecision(precision))

export default class BaseScreenshot {
  static iframeTemplate = iframeTemplate;
  static iframeStylesheet = iframeStylesheet;

  serialize = BaseComponent.prototype.serialize;

  @autobind
  setScale() {
    const iframeDocument = this.iframe.contentDocument
    const {getComputedStyle} = iframeDocument.defaultView
    const {width: widthStyle, height: heightStyle} = getComputedStyle(iframeDocument.body)
    const width = parseInt(widthStyle, 10)
    const height = parseInt(heightStyle, 10)
    const intrinsicRatio = toPrecision(height / width)
    const paddingBottom = `${intrinsicRatio * 100}%`

    this.iframe.setAttribute("width", width)
    this.iframe.setAttribute("height", height)
    this.element.style.paddingBottom = paddingBottom

    requestAnimationFrame(() => {
      const scale = toPrecision(this.element.clientWidth / width)

      this.iframe.style.transform = `scale(${scale})`
      this.element.setAttribute("data-render-state", "scaled")
    })
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
        this.setScale()
      })

      window.addEventListener("resize", () => {
        this.setScale()
      })
    }

    return this.element
  }
}
