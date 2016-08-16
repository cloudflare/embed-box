import template from "./base-target.pug"
import titleTemplate from "./title.pug"
import downloadLinkTemplate from "./download-link.pug"
import beforeContentTemplate from "./before-content.pug"
import afterContentTemplate from "./after-content.pug"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Clipboard from "clipboard"
import * as icons from "components/icons"

const AUTO_DOWNLOAD_DELAY = 3000

export default class BaseTarget extends BaseComponent {
  static template = template;
  static titleTemplate = titleTemplate;
  static beforeContentTemplate = beforeContentTemplate;
  static afterContentTemplate = afterContentTemplate;
  static downloadLinkTemplate = downloadLinkTemplate;

  static extend = function extend({id, label, policy, template, templateVars} = {}) {
    if (!id) throw new Error("EmbedBox: Target must have `id`")
    if (!label) throw new Error("EmbedBox: Target must have `label`")

    return class CustomTarget extends BaseTarget {
      static id = id;
      static label = label;
      static policy = policy || "";
      static template = template || "";
      static templateVars = templateVars || {}
      static isConstructable() {
        return true
      }
    }
  };

  static isConstructable(config, store) {
    const {policy} = this
    const hasLocalEmbedCode = !!config.embedCode
    const hasGlobalEmbedCode = !!store.embedCode
    const hasDownloadURL = !!config.downloadURL

    switch (policy) {
      case "EMBED":
        return hasDownloadURL
      case "OR":
        return hasLocalEmbedCode || hasGlobalEmbedCode || hasDownloadURL
      case "NAND":
        // A `downloadURL` must be accompanied by an `embedCode`
        return hasDownloadURL && hasLocalEmbedCode || hasGlobalEmbedCode && !hasDownloadURL
      default:
        return true
    }
  }

  constructor(spec = {}) {
    super(spec)
    this.versionID = this.config.versionID || this.versionIDs[0]
  }

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
    return this.config.downloadURL
  }

  get copyText() {
    return this.config.embedCode || this.store.embedCode
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

  get instructionsLabel() {
    return `Instructions for ${this.label} version`
  }

  get modalTitle() {
    return `Installing ${this.store.name} › ${this.label}`
  }

  get templateVars() {
    return this.constructor.templateVars
  }

  get title() {
    return `Installing ${this.store.name} onto a ${this.label} site.`
  }

  get versionIDs() {
    return this.constructor.versions.map(version => version.id)
  }

  serializeSteps(versionID) {
    const [version] = this.constructor.versions.filter(version => version.id === versionID)

    return this.serialize(version.template)
  }

  @autobind
  handleVersionChange({target: {value}}) {
    const previousElement = this.element

    this.versionID = value
    this.replaceElement(previousElement, this.render())
  }

  render() {
    const stepsElement = this.serializeSteps(this.versionID)

    this.compileTemplate()

    const {autoDownload, iframe} = this.store
    const {copyButtons = [], stepsMount, versionSelector} = this.refs

    this.replaceElement(stepsMount, stepsElement)

    if (versionSelector) {
      versionSelector.addEventListener("change", this.handleVersionChange)
    }

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

  renderTitle() {
    const icon = icons[this.id] || icons.generic

    return this.constructor.titleTemplate.call(this, {
      config: this.store,
      icon: icon.template
    })
  }

  renderDownloadLink() {
    return this.constructor.downloadLinkTemplate.call(this, {config: this.store})
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
