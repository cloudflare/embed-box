import beforeContentTemplate from "./before-content.pug"
import afterContentTemplate from "./after-content.pug"

import BaseComponent from "components/base-component"
import Clipboard from "clipboard"
import autobind from "autobind-decorator"

const AUTO_DOWNLOAD_DELAY = 3000

export default class BaseTarget extends BaseComponent {
  static beforeContentTemplate = beforeContentTemplate;
  static afterContentTemplate = afterContentTemplate;

  static extend = function extend({fallback, id, label, template, templateVars} = {}) {
    if (!id) throw new Error("EmbedBox: Target must have `id`")
    if (!label) throw new Error("EmbedBox: Target must have `label`")

    return class CustomTarget extends BaseTarget {
      static fallback = fallback || false;
      static id = id;
      static label = label;
      static template = template || "";
      static templateVars = templateVars || {}
    }
  };

  compileTemplate() {
    BaseComponent.prototype.compileTemplate.call(this, this.templateVars)

    this.element.setAttribute("data-component", `${this.id}-target`)
    this.element.setAttribute("data-column", "")
    this.element.setAttribute("autofocus", "")
    this.element.className = `markdown instructions ${this.element.className || ""}`

    return this.element
  }

  get autoDownloadLabel() {
    return this.store.autoDownload ? "(Your download should begin automatically.)" : ""
  }

  get downloadLabel() {
    return `Download the ${this.label} plugin`
  }

  get downloadURL() {
    return this.config.downloadURL || this.store.downloadURL
  }

  get copyText() {
    if (this.downloadURL) return `<script src="${this.downloadURL}"></script>`

    return this.config.embedCode || this.store.embedCode
  }

  get fallback() {
    // TODO: move this to global config.
    return this.constructor.fallback
  }

  get label() {
    return this.constructor.label
  }

  get location() {
    const targetUsesHead = this.config.insertInHead
    const storeUsesHead = this.store.insertInHead

    // Respect target specific falsey values.
    const insertInHead = typeof targetUsesHead !== "undefined" ? targetUsesHead : storeUsesHead

    return insertInHead ? "head" : "body"
  }

  get id() {
    return this.constructor.id
  }

  get templateVars() {
    return this.constructor.templateVars
  }

  render() {
    this.compileTemplate()

    const {autoDownload, iframe} = this.store
    const {copyButtons = []} = this.refs

    copyButtons.forEach(copyButton => {
      const copyableContent = copyButton.parentNode.querySelector(".copyable")

      copyableContent.addEventListener("click", () => {
        const range = iframe.document.createRange()
        const selection = iframe.window.getSelection()

        range.selectNodeContents(copyableContent)
        selection.removeAllRanges()
        selection.addRange(range)
      })

      const clipboard = new Clipboard(copyButton, {text: () => copyableContent.textContent})

      clipboard.on("success", () => {
        copyButton.setAttribute("data-status", "copied")
        setTimeout(() => copyButton.removeAttribute("data-status"), 600)
      })
    })

    if (autoDownload && this.downloadURL) {
      setTimeout(this.startDownload, AUTO_DOWNLOAD_DELAY)
    }

    return this.element
  }

  renderBeforeContent() {
    return this.constructor.beforeContentTemplate.call(this, {config: this.store})
  }

  renderAfterContent() {
    return this.constructor.afterContentTemplate.call(this, {config: this.store})
  }

  @autobind
  startDownload() {
    const downloadIframe = document.createElement("iframe")

    downloadIframe.className = "embed-box-download-iframe"
    downloadIframe.src = this.downloadURL
    document.body.appendChild(downloadIframe)
  }
}
