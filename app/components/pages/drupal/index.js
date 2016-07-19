import template from "./drupal.pug"

import BasePage from "components/base-page"

export default class DrupalPage extends BasePage {
  static fallback = false;
  static id = "drupal";
  static label = "Drupal";
  static template = template;
}
