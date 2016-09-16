import template from "./base-target.pug"
import titleTemplate from "./title.pug"
import downloadLinkTemplate from "./download-link.pug"
import beforeContentTemplate from "./before-content.pug"
import afterContentTemplate from "./after-content.pug"
import defaultIcon from "./base-target.svg"

import autobind from "autobind-decorator"
import BaseComponent from "components/base-component"
import Clipboard from "clipboard"

export default class BaseTarget extends BaseComponent {
  static template = template;
  static titleTemplate = titleTemplate;
  static beforeContentTemplate = beforeContentTemplate;
  static afterContentTemplate = afterContentTemplate;
  static downloadLinkTemplate = downloadLinkTemplate;

  static supports = {};

  static extend = function extend({icon, id, label, template, templateVars} = {}) {
    if (!id) throw new Error("EmbedBox: Target must have `id`")
    if (!label) throw new Error("EmbedBox: Target must have `label`")

    return class CustomTarget extends BaseTarget {
      static icon = icon;
      static id = id;
      static label = label;
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
    const supportsPlugin = this.supports.plugin
    const hasLocalEmbed = !!config.embedCode
    const hasGlobalEmbed = !!store.embedCode
    const embedCodePresent = hasLocalEmbed || hasGlobalEmbed
    const hasPluginURL = !!config.pluginURL

    if (supportsPlugin) return hasPluginURL || embedCodePresent

    return hasPluginURL && hasLocalEmbed || !hasPluginURL && embedCodePresent
  }

  constructor(spec = {}) {
    super(spec)

    this.versionID = this.config.versionID || this.versionIDs[0]
  }

  compileTemplate() {
    BaseComponent.prototype.compileTemplate.call(this, this.templateVars)

    this.element.setAttribute("data-component", `${this.id}-target`)
    this.element.setAttribute("data-flow", "column")
    this.element.setAttribute("autofocus", "")
    this.element.className = `target-instructions ${this.element.className || ""}`

    return this.element
  }

  get autoDownloadLabel() {
    return this.store.autoDownload ? "(Your download should begin automatically.)" : ""
  }

  get downloadLabel() {
    const supportsPlugin = this.constructor.supports.plugin

    return supportsPlugin ? `Download the ${this.label} plugin` : `Download ${this.store.name}`
  }

  get pluginURL() {
    return this.config.pluginURL
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

  get icon() {
    return this.constructor.icon || defaultIcon
  }

  get id() {
    return this.constructor.id
  }

  get instructionsLabel() {
    return `Instructions for ${this.label} version`
  }

  get headerTitle() {
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
    const stepsElement = this.serialize(version.template, this.templateVars)

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
    return this.constructor.titleTemplate.call(this, {
      config: this.store
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
    downloadIframe.src = this.pluginURL
    document.body.appendChild(downloadIframe)
  }
}
