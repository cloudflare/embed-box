import template from "./wordpress.pug"

import BasePage from "components/page"

export default class WordpressPage extends BasePage {
  static fallback = false;
  static id = "wordpress";
  static label = "WordPress";
  static template = template;
}
