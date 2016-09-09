import iframeTemplate from "./base-screenshot.pug"
import iframeStylesheet from "./screenshot-iframe.styl"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import createStylesheetTemplate from "lib/create-stylesheet-template"

const toPrecision = (number, precision = 5) => parseFloat(number.toPrecision(precision))

export default class BaseScreenshot {
  static iframeTemplate = iframeTemplate;
  static iframeStylesheet = iframeStylesheet;

  serialize = BaseComponent.prototype.serialize;
  store = BaseComponent.prototype.store;

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

  applyTheme() {
    const {iframeStylesheet, stylesheet} = this.constructor
    const iframeDocument = this.iframe.contentDocument
    const iframeStyle = iframeDocument.createElement("style")
    const style = iframeDocument.createElement("style")

    const stylesheetTemplate = createStylesheetTemplate(this.store.theme)

    const themeStyles = stylesheetTemplate`
      .screenshot .focal-point {
        box-shadow: 0 0 0 4px ${"screenshotAnnotationColor"}
      }

      .screenshot a.focal-point {
        background-color: ${"screenshotAnnotationColor"}
      }

      .screenshot [data-arrow]::before,
      .screenshot [data-arrow]::after {
        color: ${"screenshotAnnotationColor"}
      }
    `

    iframeStyle.innerHTML = [iframeStylesheet, themeStyles].join(" ")
    iframeDocument.head.appendChild(iframeStyle)

    style.innerHTML = stylesheet
    iframeDocument.head.appendChild(style)
  }

  render(target) {
    const {iframeTemplate, template} = this.constructor
    const element = this.element = this.serialize(iframeTemplate)

    this.iframe = element.querySelector("iframe")

    this.iframe.onload = () => {
      this.applyTheme()

      const iframeDocument = this.iframe.contentDocument
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
