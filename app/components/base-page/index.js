import BaseComponent from "components/base-component"
import Clipboard from "clipboard"
import {getStore} from "lib/store"
import autobind from "autobind-decorator"

const AUTO_DOWNLOAD_DELAY = 3000

export default class BasePage extends BaseComponent {
  static extend = function extend({fallback, id, label, template, templateVars} = {}) {
    if (!id) throw new Error("UniversalEmbed: Page must have `id`")
    if (!label) throw new Error("UniversalEmbed: Page must have `label`")

    return class CustomPage extends BasePage {
      static fallback = fallback || false;
      static id = id;
      static label = label;
      static template = template || "";
      static templateVars = templateVars || {}
    }
  };

  compileTemplate() {
    const {id, templateVars} = this.constructor

    BaseComponent.prototype.compileTemplate.call(this, templateVars)

    this.element.setAttribute("data-component", `${id}-page`)
    this.element.setAttribute("data-column", "")
    this.element.setAttribute("autofocus", "")
    this.element.className = `markdown instructions ${this.element.className || ""}`

    return this.element
  }

  get autoDownloadLabel() {
    return getStore().autoDownload ? "(Your download should begin automatically.)" : ""
  }

  get downloadLabel() {
    return `Download the ${this.constructor.label} plugin`
  }

  get downloadURL() {
    return getStore().downloadURLs[this.constructor.id] || ""
  }

  render() {
    this.compileTemplate()

    const {autoDownload} = getStore()
    const {copyButtons = []} = this.refs

    copyButtons.forEach(copyButton => {
      const target = copyButton.parentNode.querySelector("textarea.copyable")

      target.addEventListener("click", () => target.select())

      new Clipboard(copyButton, {text: () => target.value}) // eslint-disable-line no-new
    })

    if (autoDownload && this.downloadURL) {
      setTimeout(this.startDownload, AUTO_DOWNLOAD_DELAY)
    }

    return this.element
  }

  @autobind
  startDownload() {
    const downloadIframe = document.createElement("iframe")

    downloadIframe.className = "embed-box-download-iframe"
    downloadIframe.src = this.downloadURL
    document.body.appendChild(downloadIframe)
  }
}
