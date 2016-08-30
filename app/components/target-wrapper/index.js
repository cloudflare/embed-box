import template from "./target-wrapper.pug"
import stylesheet from "./target-wrapper.styl"

import BaseComponent from "components/base-component"

export default class TargetWrapper extends BaseComponent {
  static template = template;
  static stylesheet = stylesheet;

  render() {
    this.compileTemplate()

    const target = this.target.render()
    const {targetMount} = this.refs

    this.replaceElement(targetMount, target)

    return this.element
  }
}
