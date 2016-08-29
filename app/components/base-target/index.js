import template from "./base-target.pug"
import titleTemplate from "./title.pug"
import downloadLinkTemplate from "./download-link.pug"
import beforeContentTemplate from "./before-content.pug"
import afterContentTemplate from "./after-content.pug"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Clipboard from "clipboard"
import * as icons from "components/icons"

export default class BaseTarget extends BaseComponent {
  static template = template;
  static titleTemplate = titleTemplate;
  static beforeContentTemplate = beforeContentTemplate;
  static afterContentTemplate = afterContentTemplate;
  static downloadLinkTemplate = downloadLinkTemplate;

  static supports = {}

  static extend = function extend({id, label, policy, template, templateVars} = {}) {
    if (!id) throw new Error("EmbedBox: Target must have `id`")
    if (!label) throw new Error("EmbedBox: Target must have `label`")

    return class CustomTarget extends BaseTarget {
      static id = id;
      static label = label;
      static policy = policy || "";
      static templateVars = templateVars || {};
      static versions = [
        {id: `${id}-custom-version`, template}
      ];
      static isConstructable() {
        return true
      }
    }
  };

  static isConstructable(config, store) {
    const {plugin: supportsPlugin} = this.supports
    const hasLocalEmbed = !!config.embedCode
    const hasGlobalEmbed = !!store.embedCode
    const embedCodePresent = hasLocalEmbed || hasGlobalEmbed
    const hasDownloadURL = !!config.downloadURL

    if (supportsPlugin) return hasDownloadURL || embedCodePresent

    return hasDownloadURL && hasLocalEmbed || !hasDownloadURL && embedCodePresent
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
    return `Installing ${this.store.name} <span class="with-more-icon-after"></span> ${this.label}`
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

  @autobind
  handleVersionChange({target: {value}}) {
    this.versionID = value
    this.render()
  }

  bindCopyButtons() {
    const {iframe} = this.store
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
  }

  renderSteps() {
    const {stepsMount} = this.refs
    const [version] = this.constructor.versions.filter(version => version.id === this.versionID)
    const stepsElement = this.serialize(version.template)

    this.refs.screenshotMounts = []
    this.replaceElement(stepsMount, stepsElement)
    this.updateRefs()

    const {screenshotMounts = []} = this.refs

    screenshotMounts.forEach(screenshotMount => {
      const Screenshot = version.screenshots[screenshotMount.getAttribute("data-screenshot")]
      const screenshot = new Screenshot()

      this.replaceElement(screenshotMount, screenshot.render(this))
    })
  }

  render() {
    const previousElement = this.element

    this.compileTemplate()
    this.renderSteps()

    const {versionSelector} = this.refs

    if (versionSelector) {
      versionSelector.addEventListener("change", this.handleVersionChange)
    }

    this.bindCopyButtons()

    if (previousElement) this.replaceElement(previousElement, this.element)

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
