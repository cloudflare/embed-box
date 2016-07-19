import template from "./joomla.pug"

import BasePage from "components/base-page"

export default class JoomlaPage extends BasePage {
  static fallback = false;
  static id = "joomla";
  static label = "Joomla";
  static template = template;
}
