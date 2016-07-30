import template from "./drupal.pug"

import BaseTarget from "components/base-target"

export default class DrupalTarget extends BaseTarget {
  static fallback = false;
  static id = "drupal";
  static label = "Drupal";
  static template = template;
}
