import template from "./page-wrapper.pug"

import BaseComponent from "components/base-component"

export default class PageWrapper extends BaseComponent {
  static template = template;

  render() {
    this.compileTemplate()

    const page = this.page.render()
    const {doneButton, pageMount} = this.refs

    this.replaceElement(pageMount, page)

    doneButton.addEventListener("click", this.onDone)

    return this.element
  }
}
