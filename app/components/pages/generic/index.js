import template from "./generic.pug"

import BasePage from "components/base-page"

export default class GenericPage extends BasePage {
  static fallback = true;
  static id = "generic";
  static label = "Another CMS";
  static template = template;
}
