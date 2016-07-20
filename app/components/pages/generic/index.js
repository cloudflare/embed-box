import template from "./generic.pug"

import BasePage from "components/base-page"
import Clipboard from "clipboard"

export default class GenericPage extends BasePage {
  static fallback = true;
  static id = "generic";
  static label = "Another CMS";
  static template = template;

  render() {
    this.compileTemplate()

    const {copyButtons} = this.refs

    copyButtons.forEach(copyButton => {
      const target = copyButton.parentNode.querySelector("textarea.copyable")

      target.addEventListener("click", () => target.select())

      new Clipboard(copyButton, {text: () => target.value}) // eslint-disable-line no-new
    })

    return this.element
  }
}
