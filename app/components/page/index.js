import BaseComponent from "components/base-component"

export default class BasePage extends BaseComponent {
  static extend = function extend({fallback = false, id, label, template = "", templateVars = {}}) {
    return class CustomPage extends BasePage {
      static fallback = fallback;
      static id = id;
      static label = label;
      static template = template;
      static templateVars = templateVars
    }
  };

  compileTemplate() {
    const {id, templateVars} = this.constructor

    BaseComponent.prototype.compileTemplate.call(this, templateVars)

    this.element.setAttribute("data-component", `${id}-page`)
    this.element.setAttribute("data-column", "")
    this.element.className = "markdown instructions" + this.element.className

    return this.element
  }
}
