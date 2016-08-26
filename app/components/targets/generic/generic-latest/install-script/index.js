import template from "./install-script.pug"
import stylesheet from "./install-script.styl"

import BaseScreenshot from "components/base-screenshot"

export default class Screenshot extends BaseScreenshot {
  static template = template;
  static stylesheet = stylesheet;

  componentRendered(target) {
    const {body} = this.iframe.contentDocument
    const escaper = this.iframe.contentDocument.createElement("textarea")

    escaper.textContent = target.copyText
    const escapedText = `<div class="embed-code">${escaper.innerHTML}</div>`

    body.innerHTML = body.innerHTML.replace(/\{\{EMBED_CODE_SLOT\}\}/g, escapedText)

    this.refreshHeight()
  }
}
