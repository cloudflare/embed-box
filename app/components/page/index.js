import BaseComponent from "components/base-component"

export default class BasePage extends BaseComponent {
  static extend = function extend({fallback = false, id, label, template = ""}) {
    return class CustomPage extends BasePage {
      static fallback = fallback;
      static id = id;
      static label = label;
      static template = template;
    }
  };
}
