import template from "./drupal.pug"

import BaseTarget from "components/base-target"

export default class DrupalTarget extends BaseTarget {
  static id = "drupal";
  static label = "Drupal";
  static template = template;
}
